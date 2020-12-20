// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { verify } from "argon2";
import { Request, Response } from "express";
import { Client } from "pg";
import { PG_findUser } from "./db/user";
import { PG_findRepo } from "./db/repo";
import { isPasswordValid, isUsernameValid } from "./utils/userValidation";
import { isRepoNameValid } from "./utils/repoValidation";

export enum AuthStatus
{
    GOOD = 0,
    BAD = 1
};

interface AuthResponse
{
    status: AuthStatus;
    ownerId: number;
}

function respondUnauthorized(res: Response)
{
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", "Basic realm=\"auth needed\"");
    res.end();
}

export async function tryAuthenticate(req: Request, res: Response, owner: string, name: string, pgClient: Client): Promise<AuthResponse>
{
    if(!isUsernameValid(owner) || !isRepoNameValid(name))
    {
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    }

    const repo = (await PG_findRepo(pgClient, { name, owner })).repo;

    if(repo === undefined)
    {
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    }

    const user = await (await PG_findUser(pgClient, { username: owner })).user;
    if(user === undefined)
    {
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    }

    if(!repo.isPrivate)
    {
        return {
            status: AuthStatus.GOOD,
            ownerId: user.id
        }
    }

    if(req.headers.authorization === undefined)
    {
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    }

    let authHeader = String(req.headers.authorization.substring(6));
    let buff = Buffer.from(authHeader, "base64");
    let decodedAuthHeader = buff.toString("utf-8");

    let username = decodedAuthHeader.substring(0, decodedAuthHeader.indexOf(':'));
    let password = decodedAuthHeader.substring(decodedAuthHeader.indexOf(':') + 1);

    if(username !== owner || !isPasswordValid(password))
    {
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    }
        
    return verify(user.hash, password).then( match => {
        if(match)
        {
            return {
                status: AuthStatus.GOOD,
                ownerId: user.id
            }
        }
        
        respondUnauthorized(res);
        return {
            status: AuthStatus.BAD,
            ownerId: -1
        }
    });
}
