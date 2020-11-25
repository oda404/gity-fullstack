import { Arg, Authorized, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { rootGitDir } from "../../service/gityServer";
import { ApolloContext } from "../../types";
import { SESSION_COOKIE_NAME } from "../../consts";
import { mkdirSync, rm } from "fs";
import { join } from "path";
import { parsePGError, validateUserLoginInput, validateUserRegisterInput } from "../../utils/userValidation";
import { Repo } from "../entities/Repo";

@InputType()
export class UserLoginInput
{
    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
};

@InputType()
export class UserRegisterInput
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

@Resolver()
export class UserResolver
{
    @Authorized("basic")
    @Query(() => User, { nullable: true })
    async self(
        @Ctx() { pgCon, req }: ApolloContext
    ): Promise<User | undefined>
    {
        return pgCon.manager.findOne(User, { id: req.session.userId });
    }

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("userInput") userInput: UserRegisterInput,
        @Ctx() { pgCon }: ApolloContext
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
            return pgCon.manager.save(user).then( val => {
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
        @Ctx() { pgCon, req }: ApolloContext
    ): Promise<UserResponse>
    {
        let response = new UserResponse();
        response = await validateUserLoginInput(userInput, pgCon);

        if(response.error)
        {
            return response;
        }

        req.session.userId = String(response.user!.id);
        response.user!.aliveSessions.push(req.session.id);
        pgCon.manager.save(response.user);

        return response;
    }

    @Authorized("basic")
    @Mutation(() => Boolean, { nullable: true })
    async logoutUser(
        @Ctx() { req, res, pgCon }: ApolloContext
    ): Promise<boolean>
    {
        let user = await pgCon.manager.findOne(User, { id: req.session.userId });
        if(user !== undefined)
        {
            let index = user.aliveSessions.indexOf(req.session.id);
            if(index > -1)
            {
                user.aliveSessions.splice(index, 1);
            }
            pgCon.manager.save(user);
        }
        
        res.clearCookie(SESSION_COOKIE_NAME);
        req.session.destroy(() => {});

        return true;
    }

    @Authorized("extended")
    @Mutation(() => Boolean, { nullable: true })
    async deleteUser(
        @Ctx() { res, req, pgCon, redisClient } : ApolloContext,
        @Arg("password") password: string
    ): Promise<boolean>
    {
        let user = await pgCon.manager.findOne(User, { id: req.session.userId });
        if(user === undefined)
        {
            return false;
        }

        /* clear user's cookies */
        user.aliveSessions.forEach(sessId => redisClient.del(`sess:${sessId}`));
        res.clearCookie(SESSION_COOKIE_NAME);
        /* delete repo entries from db */
        user.repos.forEach(repo => {
            pgCon.manager.delete(Repo, { name: repo });
        });
        /* remove user's directory */
        rm(join(rootGitDir, user.username), { recursive: true, force: true }, () => {  });
        /* remove user's db entry */
        pgCon.manager.delete(User, user);

        return true;
    }

    @Authorized("extended")
    @Mutation(() => Boolean, { nullable: true })
    async changeUserEmail(
        @Ctx() { mailTransporter }: ApolloContext,
        @Arg("password") password: string,
        @Arg("newEmail") newEmail: string
    )
    {

    }

    @Authorized("extended")
    @Mutation(() => Boolean, { nullable: true })
    async changeUserPassword(
        @Ctx() { mailTransporter }: ApolloContext,
        @Arg("password") password: string,
        @Arg("newPassword") newPassword: string
    )
    {

    }
};
