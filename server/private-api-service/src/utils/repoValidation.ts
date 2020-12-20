
import { 
    REPO_NAME_MAX_LENGTH, 
    REPO_NAME_MIN_LENGTH, 
    REPO_NAME_REGEX 
} from "../../../core/src/entities/repo/consts";

interface ValidateFieldResponse
{
    result: boolean;
    err?: string;
}

export function validateRepoName(repoName: string): ValidateFieldResponse
{
    if(!repoName.match(REPO_NAME_REGEX))
    {
        return {
            result: false,
            err: "Repo name contains invalid characters"
        }
    }

    if(repoName.length > REPO_NAME_MAX_LENGTH)
    {
        return {
            result: false,
            err: `Repo name can't be longer than ${REPO_NAME_MAX_LENGTH}`
        }
    }

    if(repoName.length < REPO_NAME_MIN_LENGTH)
    {
        return {
            result: false,
            err: `Repo name can't be shorter than ${REPO_NAME_MIN_LENGTH}`
        }
    }

    return {
        result: true
    }
}
