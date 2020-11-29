import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { ApolloContext } from "../../types";
import { SESSION_COOKIE_NAME } from "../../consts";
import { mkdirSync, rm } from "fs";
import { join } from "path";
import { parsePGError, validateUserRegisterInput } from "../../utils/userValidation";
import { Repo } from "../entities/Repo";
import Container from "typedi";
import { Redis } from "ioredis";
import Mail from "nodemailer/lib/mailer";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { verify } from "argon2";
import { PG_addUser, PG_findUser, PG_updateUser, PG_deleteUser } from "../../db/user";
import { createUserGitDirOnDisk, deleteUserGitDirFromDisk } from "../../gitService/utils";

@InputType()
export class UserLoginInput
{
    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
};

@InputType()
export class UserRegisterInput implements Partial<User>
{
    @Field()
    username: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    invitation: string;
};

@ObjectType()
export class UserFieldError
{
    @Field()
    field: string;

    @Field()
    message: string;
};

@ObjectType()
export class UserResponse
{
    @Field(() => UserFieldError, { nullable: true })
    error?: UserFieldError | null = null;

    @Field(() => User, { nullable: true })
    user?: User | null = null;
};

@Resolver(of => User)
export class UserResolver
{
    private readonly pgClient = Container.get<Client>("pgClient");
    private readonly redisClient = Container.get<Redis>("redisClient");
    private readonly mailTransporter = Container.get<Mail>("mailTransporter");

    @Authorized(AUTH_COOKIE)
    @Query(() => User, { nullable: true })
    async self(
        @Ctx() { req }: ApolloContext
    ): Promise<User | undefined>
    {
        return (await PG_findUser(this.pgClient, { id: req.session.userId })).user;
    }

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("userInput") userInput: UserRegisterInput,
    ): Promise<UserResponse>
    {
        const response = new UserResponse();

        response.error = validateUserRegisterInput(userInput);
        if(response.error)
        {
            return response;
        }

        const user = new User();
        return user.build(userInput.username, userInput.email, userInput.password).then( async () => {

            return PG_addUser(this.pgClient, {
                username: userInput.username,
                email: userInput.email,
                hash: user.hash
            }).then( res => {
                if(res.err !== undefined)
                {
                    response.error = parsePGError(res.err);
                    return response;
                }

                createUserGitDirOnDisk(userInput.username);

                response.user = res.user!;
                return response;
            });
        });
    }

    @Mutation(() => UserResponse)
    async loginUser(
        @Arg("userInput") { usernameOrEmail, password }: UserLoginInput,
        @Ctx() { req }: ApolloContext
    ): Promise<UserResponse>
    {
        let response = new UserResponse();

        const user = (await PG_findUser(this.pgClient, usernameOrEmail.includes('@') ? 
            { email: usernameOrEmail } : 
            { username: usernameOrEmail })
        ).user;
        if(user === undefined)
        {
            response.error = {
                field: "usernameOrEmail",
                message: "Username or email not found"
            };
            return response;
        }

        return verify(user.hash, password).then( async result => {

            if(!result)
            {
                response.error = {
                    field: "password",
                    message: "Invalid password"
                };
                return response;
            }

            req.session.userId = String(user.id);
            user.aliveSessions.push(req.session.id);
            PG_updateUser(this.pgClient, user);
            
            response.user = user;
            return response;
        });
    }

    @Authorized(AUTH_COOKIE)
    @Mutation(() => Boolean, { nullable: true })
    async logoutUser(
        @Ctx() { req, res }: ApolloContext
    ): Promise<boolean>
    {
        const user = (await PG_findUser(this.pgClient, { id: req.session.userId })).user;
        if(user !== undefined)
        {
            let index = user.aliveSessions.indexOf(req.session.id);
            if(index > -1)
            {
                user.aliveSessions.splice(index, 1);
            }
            PG_updateUser(this.pgClient, user);
        }
        
        res.clearCookie(SESSION_COOKIE_NAME);
        req.session.destroy(() => {});

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async deleteUser(
        @Ctx() { res, user } : ApolloContext,
        @Arg("password") password: string // for the Authorized middleware
    ): Promise<boolean>
    {
        /* clear user's cookies */
        user!.aliveSessions.forEach(sessId => this.redisClient.del(`sess:${sessId}`));
        res.clearCookie(SESSION_COOKIE_NAME);
        /* delete user's repos db entries */
        user!.reposId.forEach(repo => {
            //this.pgCon.manager.delete(Repo, { name: repo });
        });
        /* remove user's directory */
        deleteUserGitDirFromDisk(user!.username);
        /* delete user's db entry */
        PG_deleteUser(this.pgClient, user!.id);

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async changeUserEmail(
        @Ctx() { user }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newEmail") newEmail: string
    ): Promise<boolean>
    {

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async changeUserPassword(
        @Ctx() { user }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newPassword") newPassword: string,
    ): Promise<boolean>
    {
        console.log(user);
        return true;
    }

    @Mutation(() => Boolean, { nullable: true })
    async forgotUserPassword(
        @Arg("usernameOrEmail") usernameOrEmail: string
    ): Promise<boolean>
    {

        return true;
    }
};
