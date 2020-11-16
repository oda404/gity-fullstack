// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { verify } from "argon2";
import { Request, Response } from "express";
import { Connection } from "typeorm";
import { User } from "../api/entities/User"

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

function validateRepoUserName(repoPath: string, username: string): boolean
{
    const lastI = repoPath.lastIndexOf('/');
    return (repoPath.substring(repoPath.lastIndexOf('/', lastI - 1) + 1, lastI) === username);
}

export async function tryAuthenticate(req: Request, res: Response, repoPath: string, dbCon: Connection): Promise<AuthResponses>
{
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

    if(!validateRepoUserName(repoPath, username))
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }

    const user = await dbCon.manager.findOne(User, { username: username });
    if(user === undefined)
    {
        respondUnauthorized(res);
        return AuthResponses.BAD;
    }
        
    return verify(user.hash, password).then(result => {
        if(result)
        {
            return AuthResponses.GOOD;
        }
        
        respondUnauthorized(res);
        return AuthResponses.BAD;
    });
}
