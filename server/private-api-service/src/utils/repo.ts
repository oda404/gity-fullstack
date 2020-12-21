import { spawn } from "child_process";
import { existsSync, mkdirSync, rm } from "fs";
import { join } from "path";
import { GIT_ROOT_DIR } from "../../../core/src/git/consts";


export function createRepoOnDisk(ownerId: number, name: string): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, ownerId.toString(), name);
    if(existsSync(joinedPath))
    {
        return false;
    }
    
    //640
    mkdirSync(joinedPath);
    spawn("git", [ "init", "--bare", joinedPath ]);
    return true;
}

export function deleteRepoFromDisk(ownerId: number, name: string): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, ownerId.toString(), name);
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

export function createUserDirOnDisk(ownerId: number): boolean
{
    try
    {
        mkdirSync(join(GIT_ROOT_DIR, ownerId.toString()));
        return true;
    } catch (_) { return false; }
}

export function deleteUserDirFromDisk(ownerId: number): boolean
{
    const joinedPath = join(GIT_ROOT_DIR, ownerId.toString());
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
