import { UserFieldError, UserRegisterInput } from "../api/resolvers/user";
import { getUserConfig } from "gity-core/config-engine";

const userConfig = getUserConfig();

const USERNAME_MIN_LENGTH = userConfig.usernameMinLen;
const USERNAME_MAX_LENGTH = userConfig.usernameMaxLen;
const USERNAME_REGEX = new RegExp(
    Buffer.from(userConfig.usernameB64Regex, "base64").toString("ascii")
);
const FORBIDDEN_USERNAMES =
    userConfig.usernamesForbidden === undefined ? 
    [] : 
    userConfig.usernamesForbidden;

const EMAIL_MAX_LENGTH = userConfig.emailMaxLen;
const EMAIL_REGEX = new RegExp(
    Buffer.from(userConfig.emailB64Regex, "base64").toString("ascii")
);

const PASSWORD_MIN_LENGTH = userConfig.passwdMinLen;
const PASSWORD_MAX_LENGTH = userConfig.passwdMaxLen;
const PASSWORD_REGEX = new RegExp(
    Buffer.from(userConfig.passwdB64Regex, "base64").toString("ascii")
);

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

export function validateUserEmail(email: string): ValidateFieldResponse
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

export function validateUserPassword(password: string): ValidateFieldResponse
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
            err: "Invalid password"
        }
    }

    return {
        result: true
    }
}

export async function validateUserRegisterInput(userInput: UserRegisterInput): Promise<UserFieldError | undefined>
{
    const valUsernameRes = validateUsername(userInput.username);
    if(!valUsernameRes.result)
    {
        return {
            field: "username",
            message: valUsernameRes.err!
        }
    }

    const valEmailRes = validateUserEmail(userInput.email);
    if(!valEmailRes.result)
    {
        return {
            field: "email",
            message: valEmailRes.err!
        }
    }

    const valPasswordRes = validateUserPassword(userInput.password);
    if(!valPasswordRes.result)
    {
        return {
            field: "password",
            message: valPasswordRes.err!
        }
    }

    return undefined;
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
