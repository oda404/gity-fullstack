import {
    REPO_NAME_MAX_LENGTH,
    REPO_NAME_MIN_LENGTH,
    REPO_NAME_REGEX
} from "../../../core/src/entities/repo/consts";

export function isRepoNameValid(name: string): boolean
{
    if(
        name.length < REPO_NAME_MIN_LENGTH ||
        name.length > REPO_NAME_MAX_LENGTH ||
        !name.match(REPO_NAME_REGEX)
    )
    {
        return false;
    }

    return true;
}
