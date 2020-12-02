import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { hashPassword, User } from "../entities/User";
import { ApolloContext } from "../../types";
import { SESSION_COOKIE_NAME } from "../../consts";
import { parsePGError, validateUserRegisterInput } from "../../utils/userValidation";
import Container from "typedi";
import { Redis } from "ioredis";
import Mail from "nodemailer/lib/mailer";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { hash, verify } from "argon2";
import { PG_addUser, PG_findUser, PG_updateUser, PG_deleteUser } from "../../db/user";
import { createUserGitDirOnDisk, deleteUserGitDirFromDisk } from "../../gitService/utils";
import { v4 as genuuidV4 } from "uuid";
import { getTestMessageUrl } from "nodemailer";
import { PG_deleteRepo } from "../../db/repo";

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
        user.username = userInput.username;
        user.email = userInput.email;
        return hashPassword(userInput.password).then( hash => {
            return PG_addUser(this.pgClient, {
                username: userInput.username,
                email: userInput.email,
                hash: hash
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
            return PG_updateUser(this.pgClient, user).then(() => {
                response.user = user;
                return response;
            });
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
        user!.reposId.forEach(repoId => PG_deleteRepo(this.pgClient, repoId));
        /* remove user's directory */
        deleteUserGitDirFromDisk(user!.username);
        /* delete user's db entry */
        PG_deleteUser(this.pgClient, user!.id);

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async changeUserEmail(
        @Ctx() { req, user }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newEmail") newEmail: string
    ): Promise<boolean>
    {
        user!.email = newEmail;
        const aliveSessionCopy = user!.aliveSessions;
        aliveSessionCopy.forEach( sessId => {
            if(sessId !== req.session.id)
            {
                this.redisClient.del(`sess:${sessId}`);
            }
        });
        user!.aliveSessions = [];
        user!.aliveSessions.push(req.session.id);
        PG_updateUser(this.pgClient, user!);

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async changeUserPassword(
        @Ctx() { user, res }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newPassword") newPassword: string
    ): Promise<boolean>
    {
        return hashPassword(newPassword).then( async hash => {
            user!.hash = hash;
            const aliveSessionCopy = user!.aliveSessions;
            aliveSessionCopy.forEach( sessId => this.redisClient.del(`sess:${sessId}`) );
            user!.aliveSessions = [];
            PG_updateUser(this.pgClient, user!);
            res.clearCookie(SESSION_COOKIE_NAME);

            return true;
        });
    }

    @Mutation(() => Boolean, { nullable: true })
    async forgotUserPassword(
        @Arg("email") email: string
    ): Promise<boolean>
    {
        let key = `forgotPassToken:${genuuidV4()}`;

        this.redisClient.exists(key).then( async foundN => {
            if(foundN > 0)
            {
                // handle regen
            }

            this.redisClient.set(key, email, "EX", 60 * 60 /* one hour */);
            // let mail =  await this.mailTransporter.sendMail({
            //     from: "no-reply",
            //     to: email,
            //     subject: "[Gity] Password reset request",
            //     html: `Your password reset link is <a href=\"localhost:3000\">${key}</a>`
            // });

            // console.log(getTestMessageUrl(mail));
        });

        return true;
    }
};
