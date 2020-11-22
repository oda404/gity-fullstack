import { verify } from "argon2";
import { Connection } from "typeorm";
import { User } from "../api/entities/User";
import { UserFieldError, UserLoginInput, UserRegisterInput, UserResponse } from "../api/resolvers/user";

function isInvitationValid(invitation: string): boolean
{
    if(invitation === "")
    {
        return false;
    }

    return true;
};

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

export function validateUserRegisterInput(userInput: UserRegisterInput): UserFieldError | null
{
    /* check username length */
    if(userInput.username.length < 3)
    {
        return {
            field: "username",
            message: "Username can't be shorter than 3 characters"
        };
    }

    // /* check username for forbidden chars */
    if(!userInput.username.match(USERNAME_REGEX))
    {
        return {
            field: "username",
            message: "The username can only contain letters, numbers and the -_ symbols"
        };
    }

    /* check email validity */
    if(!userInput.email.match(EMAIL_REGEX))
    {
        return {
            field: "email",
            message: "Invalid email"
        };
    }

    /* check password length */
    if(userInput.password.length < 8)
    {
        return {
            field: "password",
            message: "Password can't be shorter than 8 characters"
        };
    }

    if(!isInvitationValid(userInput.invitation))
    {
        return {
            field: "invitation",
            message: "Bad invitation"
        };
    }

    return null;
}

export async function validateUserLoginInput(userInput: UserLoginInput, con: Connection): Promise<UserResponse>
{
    let user = await con.manager.findOne(
        User, 
        userInput.usernameOrEmail.includes('@') ? 
        { email: userInput.usernameOrEmail } :
        { username: userInput.usernameOrEmail } 
    );

    if(user === undefined)
    {
        return {
            error: {
                field: "usernameOrEmail",
                message: "Username or email not found"
            }
        };
    }

    return verify(user.hash, userInput.password).then( result => {

        if(!result)
        {
            return {
                error: {
                    field: "password",
                    message: "Invalid password"
                }
            };
        }

        return {
            user
        }
    });
}

export function parsePGError(err: any): UserFieldError
{
    if(err.code == 23505)
    {
        let column = err.detail.substring(5, err.detail.indexOf(')', 5)) as string;

        if(column === "username")
        {
            return {
                field: "username",
                message: "Username already taken"
            };
        }
        else if(column === "email")
        {
            return {
                field: "email",
                message: "Email already taken"
            };
        }
    }

    return {
        field: "null",
        message: "Interval server error"
    };
}
