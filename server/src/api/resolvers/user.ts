import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { rootGitDir } from "../../service/gityServer";
import { ApolloContext } from "../../types";
import { verify } from "argon2";
import { SESSION_COOKIE_NAME } from "../../consts";
import { mkdirSync } from "fs";
import { join } from "path";

@InputType()
class UserLoginInput
{
    @Field()
    usernameOrEmail: string;

    @Field()
    password: string;
};

@InputType()
class UserRegisterInput
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
class UserFieldError
{
    @Field()
    field: string;

    @Field()
    error: string;
};

@ObjectType()
class UserResponse
{
    @Field(() => [ UserFieldError ], { nullable: true })
    errors?: UserFieldError[] = undefined;

    @Field(() => User, { nullable: true })
    user?: User = undefined;
};

function isInvitationValid(invitation: string): boolean
{
    if(invitation === "")
    {
        return false;
    }

    return true;
};

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

@Resolver()
export class UserResolver
{
    // debug query
    @Query(() => User, { nullable: true })
    async self(
        @Ctx() { con, req }: ApolloContext
    ): Promise<User | undefined>
    {
        if(req.session.userId === undefined)
        {
            return undefined;
        }

        return con.manager.findOne(User, { id: req.session.userId });
    }

    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("userInput") userInput: UserRegisterInput,
        @Ctx() { con }: ApolloContext
    ): Promise<UserResponse>
    {
        const response = new UserResponse();

        /* check username length */
        if(userInput.username.length < 3)
        {
            response.errors = [{
                field: "username",
                error: "Username can't be shorter than 3 characters"
            }];
            return response;
        }

        // /* check username for forbidden chars */
        if(!userInput.username.match(USERNAME_REGEX))
        {
            response.errors = [{
                field: "username",
                error: "The username can only contain letters, numbers and the -_ symbols"
            }];
            return response;
        }

        /* check email validity */
        if(!userInput.email.match(EMAIL_REGEX))
        {
            response.errors = [{
                field: "email",
                error: "Invalid email"
            }];
            return response;
        }

        /* check password length */
        if(userInput.password.length < 8)
        {
            response.errors = [{
                field: "password",
                error: "Password can't be shorter than 8 characters"
            }];
            return response;
        }

        if(!isInvitationValid(userInput.invitation))
        {
            response.errors = [{
                field: "invitation",
                error: "Bad invitation"
            }];
            return response;
        }

        /* check if user with same username/email exists */
        let testUser = await con.manager.findOne(User, { username: userInput.username });
        if(testUser !== undefined)
        {
            response.errors = [{
                field: "username",
                error: "Username taken"
            }];
            return response;
        }
        
        testUser = await con.manager.findOne(User, { email: userInput.email });
        if(testUser !== undefined)
        {
            response.errors = [{
                field: "email",
                error: "Email taken"
            }];
            return response;
        }

        const user = new User();
        return user.build(userInput.username, userInput.email, userInput.password).then( async () => {
            mkdirSync(join(rootGitDir, userInput.username));
            response.user = await con.manager.save(user);
            return response;
        });
    }

    @Mutation(() => UserResponse)
    async loginUser(
        @Arg("userInput") userInput: UserLoginInput,
        @Ctx() { con, req }: ApolloContext
    ): Promise<UserResponse>
    {
        const response = new UserResponse();

        let user = await con.manager.findOne(User, { email: userInput.usernameOrEmail });
        if(user === undefined)
        {
            user = await con.manager.findOne(User, { username: userInput.usernameOrEmail });

            if(user === undefined)
            {
                response.errors = [{
                    field: "usernameOrEmail",
                    error: "Username or email not found"
                }];
                return response;
            }
        }

        return verify(user.hash, userInput.password).then(result => {
            if(!result)
            {
                response.errors = [{
                    field: "password",
                    error: "Invalid password"
                }];
                return response;
            }

            req.session.userId = String(user!.id);

            response.user = user;
            return response;
        });
    }

    @Mutation(() => Boolean)
    async logoutUser(
        @Ctx() { req, res }: ApolloContext
    )
    {
        if(req.session.userId === undefined)
        {
            return false;
        }

        res.clearCookie(SESSION_COOKIE_NAME);
        return req.session.destroy((err) => {
            if(err)
            {
                return false;
            }

            return true;
        });
    }
};
