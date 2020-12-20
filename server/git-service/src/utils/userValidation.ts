
import { 
    USERNAME_MAX_LENGTH,
    USERNAME_REGEX, 
    USERNAME_MIN_LENGTH,
    FORBIDDEN_USERNAMES,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_REGEX
} from "../../../core/src/entities/user/consts";

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
