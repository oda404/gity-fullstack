
import { readFileSync } from "fs";

export function validateGitConfig(): boolean
{
    return true;
}

export function getGitReposRootDir(): string | undefined
{
    return JSON.parse(readFileSync("/etc/gity/git.json").toString())["repos-root-dir"];
}
