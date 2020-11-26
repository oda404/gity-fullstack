import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { rootGitDir } from "../../service/gityServer";
import { ApolloContext } from "../../types";
import { SESSION_COOKIE_NAME } from "../../consts";
import { mkdirSync, rm } from "fs";
import { join } from "path";
import { parsePGError, validateUserLoginInput, validateUserRegisterInput } from "../../utils/userValidation";
import { Repo } from "../entities/Repo";
import Container, { Service } from "typedi";
import { Connection } from "typeorm";
import { Redis } from "ioredis";
import Mail from "nodemailer/lib/mailer";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";

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
    private readonly pgCon = Container.get<Connection>("pgCon");
    private readonly redisClient = Container.get<Redis>("redisClient");
    private readonly mailTransporter = Container.get<Mail>("mailTransporter");

    @Authorized(AUTH_COOKIE)
    @Query(() => User, { nullable: true })
    async self(
        @Ctx() { req }: ApolloContext
    ): Promise<User | undefined>
    {
        return this.pgCon.manager.findOne(User, { id: req.session.userId });
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
            return this.pgCon.manager.save(user).then( val => {
                try
                {
                    mkdirSync(join(rootGitDir, userInput.username));
                }
                catch(err) {  }

                response.user = val;
                return response;
            }).catch( err => {
                response.error = parsePGError(err);
                return response;
            });
        });
    }

    @Mutation(() => UserResponse)
    async loginUser(
        @Arg("userInput") userInput: UserLoginInput,
        @Ctx() { req }: ApolloContext
    ): Promise<UserResponse>
    {
        let response = new UserResponse();
        response = await validateUserLoginInput(userInput, this.pgCon);

        if(response.error)
        {
            return response;
        }

        req.session.userId = String(response.user!.id);
        response.user!.aliveSessions.push(req.session.id);
        this.pgCon.manager.save(response.user);

        return response;
    }

    @Authorized(AUTH_COOKIE)
    @Mutation(() => Boolean, { nullable: true })
    async logoutUser(
        @Ctx() { req, res }: ApolloContext
    ): Promise<boolean>
    {
        let user = await this.pgCon.manager.findOne(User, { id: req.session.userId });
        if(user !== undefined)
        {
            let index = user.aliveSessions.indexOf(req.session.id);
            if(index > -1)
            {
                user.aliveSessions.splice(index, 1);
            }
            this.pgCon.manager.save(user);
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
        /* delete repo entries from db */
        user!.repos.forEach(repo => {
            this.pgCon.manager.delete(Repo, { name: repo });
        });
        /* remove user's directory */
        rm(join(rootGitDir, user!.username), { recursive: true, force: true }, () => {  });
        /* remove user's db entry */
        this.pgCon.manager.delete(User, user);

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
