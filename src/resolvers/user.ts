import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User, getHashedPassword } from "../entities/User";
import { ApolloContext } from "../types";
import { __email_regex__, __username_regex__ } from "../consts";

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

@Resolver()
export class UserResolver
{
    @Mutation(() => UserResponse)
    async registerUser(
        @Arg("userInput") userInput: UserRegisterInput,
        @Ctx() { con }: ApolloContext
    ): Promise<UserResponse>
    {
        const response = new UserResponse();
        /* check email validity */
        if(!userInput.email.match(__email_regex__))
        {
            response.errors = [{
                field: "email",
                error: "Invalid email"
            }];
            return response;
        }

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
        if(!userInput.username.match(__username_regex__))
        {
            response.errors = [{
                field: "username",
                error: "The username can only contain letters, numbers and the -_ symbols"
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

        /* check if user with same username/email exists */
        let user = await con.manager.findOne(User, { username: userInput.username });
        if(user !== undefined)
        {
            response.errors = [{
                field: "username",
                error: "Username taken"
            }];
            return response;
        }

        user = await con.manager.findOne(User, { email: userInput.email });
        if(user !== undefined)
        {
            response.errors = [{
                field: "email",
                error: "Email taken"
            }];
            return response;
        }

        response.user = await con.manager.save(new User(userInput.username, userInput.email, userInput.password));
        return response;
    }

    @Query(() => UserResponse)
    async loginUser(
        @Arg("userInput") userInput: UserLoginInput,
        @Ctx() { con }: ApolloContext
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
                    field: "username or email",
                    error: "Username or email not found"
                }];
                return response;
            }
        }

        const testHash = getHashedPassword(userInput.password, user.salt);
        if(testHash !== user.hash)
        {
            response.errors = [{
                field: "password",
                error: "Invalid password"
            }];
            return response;
        }

        response.user = user;
        return response;
    }
};
