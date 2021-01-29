import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { ApolloContext } from "../../types";
import { SESSION_COOKIE_NAME } from "../../consts";
import { parsePGError, validateUserEmail, validateUsername, validateUserPassword, validateUserRegisterInput } from "../../utils/userValidation";
import Container from "typedi";
import { Redis } from "ioredis";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { verify } from "argon2";
import { PG_addUser, PG_findUserByEmail, PG_findUserByUsername, PG_updateUser, PG_deleteUser, PG_logoutUser, PG_findUserById } from "../../db/user";
import { clearUnusedCookies } from "../../utils/clearUnusedCookies";
import { createUserDirOnDisk, deleteUserDirFromDisk } from "../../utils/repo";
import { deleteInvitation, genInvitation, getInvitation } from "../../utils/invitation";
import { hashPassword } from "../../utils/hashPassword";

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
    error?: UserFieldError;

    @Field(() => User, { nullable: true })
    user?: User;
};

@Resolver(User)
export class UserResolver
{
    private readonly pgClient = Container.get<Client>("pgClient");
    private readonly redisClient = Container.get<Redis>("redisClient");

    @Authorized(AUTH_COOKIE)
    @Query(() => User, { nullable: true })
    async getSelfUser(
        @Ctx() { req }: ApolloContext
    ): Promise<User | undefined>
    {
        return (await PG_findUserById(this.pgClient, req.session.userId!)).user;
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("userInput") userInput: UserRegisterInput,
    ): Promise<UserResponse>
    {
        const response = new UserResponse();

        response.error = await validateUserRegisterInput(userInput);
        if(response.error !== undefined)
        {
            return response;
        }

        const masterId = await getInvitation(userInput.invitation);
        if(masterId === null)
        {
            response.error = {
                field: "invitation",
                message: "Invalid invitation"
            };
            return response;
        }

        return PG_addUser(this.pgClient, {
            username: userInput.username,
            email: userInput.email,
            hash: await hashPassword(userInput.password),
            masterId
        }).then( async res => {
            if(res.user === undefined)
            {
                response.error = parsePGError(res.err);
                return response;
            }

            if(!createUserDirOnDisk(res.user.id)) 
            {
                PG_deleteUser(this.pgClient, res.user.id);
                response.error = {
                    field: "null",
                    message: "Internal server error"
                };
                return response;
            }
            
            /* the invitation remains valid unless the user is successfully registered */
            await deleteInvitation(userInput.invitation);

            response.user = res.user!;
            return response;
        });
    }

    @Mutation(() => UserResponse)
    async loginUser(
        @Arg("userInput") { usernameOrEmail, password }: UserLoginInput,
        @Ctx() { req }: ApolloContext
    ): Promise<UserResponse>
    {
        let response = new UserResponse();
        const isUsername = !usernameOrEmail.includes('@');
        let user: User | undefined;

        const responseErrorUsername = () => {
            response.error = {
                field: "usernameOrEmail",
                message: "Username or email not found"
            }
        }

        if(isUsername)
        {
            if(!validateUsername(usernameOrEmail))
            {
                responseErrorUsername();
                return response;
            }
            user = (await (PG_findUserByUsername(this.pgClient, usernameOrEmail))).user;
        }
        else
        {
            if(!validateUserEmail(usernameOrEmail))
            {
                responseErrorUsername();
                return response;
            }
            user = (await (PG_findUserByEmail(this.pgClient, usernameOrEmail))).user;
        }

        if(user === undefined)
        {
            responseErrorUsername();
            return response;
        }

        if(!(await verify(user.hash, password)))
        {
            response.error = {
                field: "password",
                message: "Invalid password"
            };
            return response;
        }
        
        /* checks for and deletes unused cookies in pg */
        await clearUnusedCookies(user, this.redisClient);

        if(user.aliveSessions.indexOf(req.session.id) === -1)
        {
            user.aliveSessions.push(req.session.id);
        }

        return PG_updateUser(this.pgClient, user).then(result => {
            if(result.err !== undefined)
            {
                response.error = {
                    field: "null",
                    message: "Intenal server error"
                }
                return response;
            }

            /* only set cookie if we can update */
            req.session.userId = user!.id;

            response.user = result.user;
            return response;
        });
    }

    @Authorized(AUTH_COOKIE)
    @Mutation(() => Boolean, { nullable: true })
    async logoutUser(
        @Ctx() { req, res }: ApolloContext
    ): Promise<boolean>
    {
        PG_logoutUser(this.pgClient, req.session.userId!, req.session.id);
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
        /* remove user's directory */
        deleteUserDirFromDisk(user!.id);
        /* delete user's db entry */
        PG_deleteUser(this.pgClient, user!.id);

        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async updateUserEmail(
        @Ctx() { req, user }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newEmail") newEmail: string
    ): Promise<boolean>
    {
        if(!validateUserEmail(newEmail).result)
        {
            return false;
        }
        user!.email = newEmail;
        /* delete each sessions except the current one */
        user!.aliveSessions.forEach( sessId => {
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
    async updateUserPassword(
        @Ctx() { user, res }: ApolloContext,
        @Arg("password") password: string, // for the Authorized middleware
        @Arg("newPassword") newPassword: string
    ): Promise<boolean>
    {
        if(!validateUserPassword(newPassword).result)
        {
            return false;
        }
        user!.hash = (await hashPassword(newPassword));
        user!.aliveSessions.forEach( sessId => this.redisClient.del(`sess:${sessId}`) );
        user!.aliveSessions = [];
        res.clearCookie(SESSION_COOKIE_NAME);
        PG_updateUser(this.pgClient, user!);
        return true;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => String, { nullable: true })
    async generateInvitation(
        @Ctx() { user }: ApolloContext,
        @Arg("password") password: string
    ): Promise<string>
    {
        return genInvitation(user!.id);
    }

    @Query(() => User, { nullable: true })
    async getUser(
        @Arg("username") username: string
    ): Promise<User | undefined | null>
    {
        if(!validateUsername(username).result)
        {
            return null;
        }

        return (await PG_findUserByUsername(this.pgClient, username)).user;
    }
};
