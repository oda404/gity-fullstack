// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { RequestHandler, Response } from "express";
import { Client } from "pg";
import { tryAuthenticate } from "./auth";
import { parse } from "url";
import { GIT_ROOT_DIR } from "./consts";
import { join } from "path";
import { setHeaderNoCache } from "./utils/headers";
import { isServiceValid } from "./git/validServices";
import { handleGETService } from "./git/handleGET";
import { handlePOSTService } from "./git/handlePOST";
import { RepoInfo } from "./utils/repoInfo";

function getRepoInfoFromUrl(url: string): RepoInfo
{
    const i = url.indexOf('/', 1);
    const owner = url.substring(1, i);
    const name = url.substring(i + 1, url.indexOf('/', i + 1));
    return { owner, name };
}

function respondUnauthorized(res: Response)
{
    res.statusCode = 401;
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("WWW-Authenticate", "Basic realm=\"authorization needed\"");
    res.end("repository doesn't exist");
}

export function gitService(pgClient: Client): RequestHandler
{
    return async (req, res, next) => {

        if(req.headers["user-agent"]?.includes("git/"))
        {
            setHeaderNoCache(res);

            if(req.method === "GET" || req.method === "HEAD")
            {
                const queries = parse(String(req.url), true);
                const service = String(queries.query["service"]);
                if(!isServiceValid(service))
                {
                    next();
                    return;
                }
                
                const repoInfo = getRepoInfoFromUrl(String(req.url));
                const authRes = await tryAuthenticate(
                    repoInfo,
                    req.headers["authorization"], 
                    service === "git-receive-pack",
                    pgClient
                );

                if(authRes.status)
                {
                    const repoPath = join(GIT_ROOT_DIR, authRes.ownerId!.toString(), repoInfo.name);
                    handleGETService(service, req, res, repoPath);
                }
                else
                {
                    respondUnauthorized(res);
                }

                return;
            }
            else if(req.method === "POST")
            {
                const service = String(req.url?.substring(req.url.lastIndexOf('/') + 1));
                if(!isServiceValid(service))
                {
                    next();
                    return;
                }

                const repoInfo = getRepoInfoFromUrl(String(req.url));
                const authRes = await tryAuthenticate(
                    repoInfo,
                    req.headers["authorization"], 
                    service === "git-receive-pack",
                    pgClient
                );

                if(authRes.status)
                {
                    const repoPath = join(GIT_ROOT_DIR, authRes.ownerId!.toString(), repoInfo.name);
                    handlePOSTService(service, req, res, repoPath);
                }
                else
                {
                    respondUnauthorized(res);
                }

                return;
            }
            else
            {
                res.status(405);
                res.setHeader("Content-Type", "text/plain");
                res.end(`unknown method ${req.method}`);
                return;
            }
        }

        next();
    }
}
