import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { rm } from "fs";
import { join } from "path";
import { GIT_ROOT_DIR } from "./consts";

export function createGitRepoOnDisk(repoPath: string): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, repoPath);
    if(existsSync(joinedPath))
    {
        return false;
    }

    mkdirSync(joinedPath)
    spawn("git", [ "init", "--bare", joinedPath ]);
    return true;
}

export function deleteGitRepoFromDisk(repoPath: string): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, repoPath);
    if(existsSync(joinedPath))
    {
        rm(joinedPath, { recursive: true, force: true },  () => {});
        return true;
    }
    else
    {
        return false;
    }
}

export function createUserGitDirOnDisk(username: string): boolean
{
    try
    {
        mkdirSync(join(GIT_ROOT_DIR, username));
        return true;
    } catch (_) { return false; }
}

export function deleteUserGitDirFromDisk(username: string): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, username);
    if(existsSync(joinedPath))
    {
        rm(joinedPath, { recursive: true, force: true },  () => {});
        return true;
    }
    else
    {
        return false;
    }
}
