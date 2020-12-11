import { UserFieldError, UserRegisterInput } from "../api/resolvers/user";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_MAX_LENGTH = 80;

const USERNAME_REGEX = /^[a-zA-Z0-9\-_]*$/;
const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 35;
const FORBIDDEN_USERNAMES = [
    "login",
    "regiser",
    "new",
    "tos",
];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 80;
const PASSWORD_REGEX = /^(.*?)$/;

interface ValidateFieldResponse
{
    result: boolean;
    err?: string;
}

export function validateUsername(username: string): ValidateFieldResponse
{
    if(username.length < USERNAME_MIN_LENGTH)
    {
        return {
            result: false,
            err: `Username can't be shorter than ${USERNAME_MIN_LENGTH} characters`
        }
    }

    if(username.length > USERNAME_MAX_LENGTH)
    {
        return {
            result: false,
            err: `Username can't be longer than ${USERNAME_MAX_LENGTH} characters`
        }
    }

    if(!username.match(USERNAME_REGEX))
    {
        return {
            result: false,
            err: "The username can only contain letters, numbers and the -_ symbols"
        }
    }

    if(FORBIDDEN_USERNAMES.indexOf(username) > -1)
    {
        return {
            result: false,
            err: "The username you chose is reserved"
        }
    }

    return {
        result: true
    }
}

export function validateEmail(email: string): ValidateFieldResponse
{
    if(email.length > EMAIL_MAX_LENGTH)
    {
        return {
            result: false,
            err: `Email can't be longer than ${EMAIL_MAX_LENGTH}`
        }
    }

    if(!email.match(EMAIL_REGEX))
    {
        return {
            result: false,
            err: "Invalid email"
        }
    }

    return {
        result: true
    }
}

export function validatePassword(password: string): ValidateFieldResponse
{
    /* check password length */
    if(password.length < PASSWORD_MIN_LENGTH)
    {
        return {
            result: false,
            err: `Password can't be shorter than ${PASSWORD_MIN_LENGTH} characters`
        }
    }

    if(password.length > PASSWORD_MAX_LENGTH)
    {
        return {
            result: false,
            err: `Password can't be longer than ${PASSWORD_MAX_LENGTH} characters`
        }
    }

    if(!password.match(PASSWORD_REGEX))
    {
        return {
            result: false,
            err: "something about password"
        }
    }

    return {
        result: true
    }
}

export function validateInvitation(invitation: string): ValidateFieldResponse
{
    if(invitation === "")
    {
        return {
            result: false,
            err: "Bad invitation"
        }
    }

    return {
        result: true
    }
}

export function validateUserRegisterInput(userInput: UserRegisterInput): UserFieldError | null
{
    const valUsernameRes = validateUsername(userInput.username);
    if(!valUsernameRes.result)
    {
        return {
            field: "username",
            message: valUsernameRes.err!
        }
    }

    const valEmailRes = validateEmail(userInput.email);
    if(!valEmailRes.result)
    {
        return {
            field: "email",
            message: valEmailRes.err!
        }
    }

    const valPasswordRes = validatePassword(userInput.password);
    if(!valPasswordRes.result)
    {
        return {
            field: "password",
            message: valPasswordRes.err!
        }
    }

    const valInvitationRes = validateInvitation(userInput.invitation);
    if(!valInvitationRes.result)
    {
        return {
            field: "invitation",
            message: valInvitationRes.err!
        }
    }

    return null;
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
