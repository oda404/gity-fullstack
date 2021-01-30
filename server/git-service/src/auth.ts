// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { verify } from "argon2";
import { Client } from "pg";
import { PG_findUser } from "./db/user";
import { PG_findRepo } from "./db/repo";
import { isPasswordValid, isUsernameValid } from "./utils/userValidation";
import { isRepoNameValid } from "./utils/repoValidation";
import { RepoInfo } from "./utils/repoInfo";

interface AuthResponse
{
    status: boolean;
    /* only set if status is true */
    ownerId?: number;
}

export async function tryAuthenticate(
    { owner, name }: RepoInfo,
    authHeader: string | undefined, 
    isReceivePack: boolean,
    pgClient: Client
): Promise<AuthResponse>
{
    const getBadAuthResponse = (): AuthResponse => {
        return {
            status: false,
        };
    }

    /* check input validity */
    if(!isUsernameValid(owner) || !isRepoNameValid(name))
    {
        return getBadAuthResponse();
    }

    // can be optimized using only 1 query
    /* try to find repo */
    const repo = (await PG_findRepo(pgClient, { name, owner })).repo;
    if(repo === undefined)
    {
        return getBadAuthResponse();
    }

    /* try to find user */
    const user = (await PG_findUser(pgClient, owner)).user;
    if(user === undefined)
    {
        return getBadAuthResponse();
    }

    /* 
    allow if request is not a receive-pack (clone) and
    if the repo is public
    */
    if(!repo.isPrivate && !isReceivePack)
    {
        return {
            status: true,
            ownerId: user.id
        }
    }

    /* check for the auth header */
    if(authHeader === undefined)
    {
        return getBadAuthResponse();
    }

    const decodedAuthHeader = Buffer.from(
        authHeader.substring(6), 
        "base64"
    ).toString("utf-8");
    const username = decodedAuthHeader.substring(
        0, 
        decodedAuthHeader.indexOf(':')
    );
    const password = decodedAuthHeader.substring(
        decodedAuthHeader.indexOf(':') + 1
    );
    
    /* 
    check if the name in the url is 
    the same as the one in the auth header
    and if the password is valid
    */
    if(username !== owner || !isPasswordValid(password))
    {
        return getBadAuthResponse();
    }

    /* verify the password */
    if(!(await verify(user.hash, password)))
    {
        return getBadAuthResponse();
    }

    return {
        status: true,
        ownerId: user.id
    }
}
