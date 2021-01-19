
import { getRepoConfig } from "gity-core/config-engine";

const repoConfig = getRepoConfig();

const REPO_NAME_MIN_LENGTH = repoConfig.nameMinLen;
const REPO_NAME_MAX_LENGTH = repoConfig.nameMaxLen;
const REPO_NAME_REGEX = new RegExp(
    Buffer.from(repoConfig.nameB64Regex, "base64").toString("ascii")
);

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
            err: "Repository name contains invalid characters"
        }
    }

    if(repoName.length > REPO_NAME_MAX_LENGTH)
    {
        return {
            result: false,
            err: `Repository name can't be longer than ${REPO_NAME_MAX_LENGTH}`
        }
    }

    if(repoName.length < REPO_NAME_MIN_LENGTH)
    {
        return {
            result: false,
            err: `Repository name can't be shorter than ${REPO_NAME_MIN_LENGTH}`
        }
    }

    return {
        result: true
    }
}
