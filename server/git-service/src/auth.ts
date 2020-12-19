// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { verify } from "argon2";
import { Request, Response } from "express";
import { Client } from "pg";
import { PG_findUser } from "./db/user";
import { PG_findRepo } from "./db/repo";

export enum AuthResponses
{
    GOOD = 0,
    BAD = 1
};

function respondUnauthorized(res: Response)
{
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", "Basic realm=\"auth needed\"");
    res.end();
}

export async function tryAuthenticate(req: Request, res: Response, repoPath: string, pgClient: Client): Promise<AuthResponses>
{
    const lastIndexOfSlash = repoPath.lastIndexOf('/');
    
    /* wtf is this */
    const URLRepoName = repoPath.substring(lastIndexOfSlash + 1, repoPath.length);
    const URLRepoOwner = repoPath.substring(repoPath.lastIndexOf('/', lastIndexOfSlash - 1) + 1, lastIndexOfSlash);

    const repo = (await PG_findRepo(pgClient, { name: URLRepoName, owner: URLRepoOwner })).repo;

    if(repo === undefined)
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }

    if(!repo.isPrivate)
    {
        return AuthResponses.GOOD;
    }

    if(req.headers.authorization === undefined)
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }

    let authHeader = String(req.headers.authorization.substring(6));
    let buff = Buffer.from(authHeader, "base64");
    let decodedAuthHeader = buff.toString("utf-8");

    let username = decodedAuthHeader.substring(0, decodedAuthHeader.indexOf(':'));
    let password = decodedAuthHeader.substring(decodedAuthHeader.indexOf(':') + 1);

    if(username !== URLRepoOwner)
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }

    const user = await (await PG_findUser(pgClient, { username })).user;
    if(user === undefined)
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }
        
    return verify(user.hash, password).then( match => {
        if(match)
        {
            return AuthResponses.GOOD;
        }
        
        respondUnauthorized(res);
        return AuthResponses.BAD;
    });
}
