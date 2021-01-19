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

const PASSWORD_MIN_LENGTH = userConfig.passwdMinLen;
const PASSWORD_MAX_LENGTH = userConfig.passwdMaxLen;
const PASSWORD_REGEX = new RegExp(
    Buffer.from(userConfig.passwdB64Regex, "base64").toString("ascii")
);

export function isUsernameValid(username: string): boolean
{
    if(
        username.length < USERNAME_MIN_LENGTH        ||
        username.length > USERNAME_MAX_LENGTH        ||
        !username.match(USERNAME_REGEX)              ||
        (FORBIDDEN_USERNAMES.indexOf(username) > -1)
    )
    {
        return false;
    }

    return true;
}

export function isPasswordValid(password: string): boolean
{
    if(
        password.length < PASSWORD_MIN_LENGTH ||
        password.length > PASSWORD_MAX_LENGTH ||
        !password.match(PASSWORD_REGEX)
    )
    {
        return false;
    }

    return true;
}
