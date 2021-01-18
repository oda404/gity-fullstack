import { getRepoConfig } from "gity/config-engine";

const repoConfig = getRepoConfig();

const REPO_NAME_MIN_LENGTH = repoConfig.nameMinLen;
const REPO_NAME_MAX_LENGTH = repoConfig.nameMaxLen;
const REPO_NAME_REGEX = new RegExp(
    Buffer.from(repoConfig.nameB64Regex, "base64").toString("ascii")
);

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
