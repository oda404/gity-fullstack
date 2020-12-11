
export const REPO_NAME_MAX_LENGTH = 35;
const REPO_NAME_MIN_LENGTH = 3;
const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

export const REPO_DESCRIPTION_MAX_LENGTH = 100;
const REPO_DESCRIPTION_MIN_LENGTH = 3;
const REPO_DESCRIPTION_REGEX =  /^[a-zA-Z0-9\-_]*$/;

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
