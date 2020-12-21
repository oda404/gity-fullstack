// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { Request, RequestHandler, Response } from "express";
import { spawn } from "child_process";
import { Client } from "pg";
import { tryAuthenticate, AuthStatus } from "./auth";
import { parse } from "url";
import { GIT_ROOT_DIR } from "./consts";
import { join } from "path";

function pack(message: string): string
{
    let n = (4 + message.length).toString(16);
    return Array(4 - n.length + 1).join('0') + n + message;
}

const validServices = [ "git-upload-pack", "git-receive-pack" ];

function handleGETService(service: string, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-advertisement`);

    targetRes.write(pack(`# service=${service}\n`) + "0000");

    spawn(service, [ "--stateless-rpc", "--advertise-refs", repoPath ]).stdout.pipe(targetRes);
}

function handlePOSTService(service: string, req: Request, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-result`);

    const proc = spawn(service, [ "--stateless-rpc", repoPath ]);
    req.pipe(proc.stdin);
    proc.stdout.pipe(targetRes);
}

function isServiceValid(service: string): boolean
{
    return !(validServices.indexOf(service) === -1)
}

interface RepoInfo
{
    owner: string;
    name: string;
}

function getRepoInfoFromUrl(url: string): RepoInfo
{
    const i = url.indexOf('/', 1);
    const owner = url.substring(1, i);
    const name = url.substring(i + 1, url.indexOf('/', i + 1));
    return { owner, name };
}

export function gitService(pgClient: Client): RequestHandler
{
    return (req, res, next) => {

        if(req.headers["user-agent"]?.includes("git/"))
        {
            res.setHeader("Expires", "Fri, 01 Jan 1980 00:00:00 GMT")
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate");

            if(req.method === "GET" || req.method === "HEAD")
            {
                const queries = parse(String(req.url), true);
                const parsedService = String(queries.query["service"]);
                
                if(!isServiceValid(parsedService))
                {
                    next();
                    return;
                }
                
                const repoInfo = getRepoInfoFromUrl(String(req.url));
                tryAuthenticate(req, res, repoInfo.owner, repoInfo.name, pgClient).then( authRes => {
                    if(authRes.status === AuthStatus.GOOD)
                    {
                        const repoPath = join(GIT_ROOT_DIR, authRes.ownerId.toString(), repoInfo.name);
                        handleGETService(parsedService, res, repoPath);
                    }
                });

                return;
            }
            else if(req.method === "POST")
            {
                const parsedService = String(req.url?.substring(req.url.lastIndexOf('/') + 1));

                if(!isServiceValid(parsedService))
                {
                    next();
                    return;
                }

                const repoInfo = getRepoInfoFromUrl(String(req.url));

                tryAuthenticate(req, res, repoInfo.owner, repoInfo.name, pgClient).then( authRes => {
                    if(authRes.status === AuthStatus.GOOD)
                    {
                        const repoPath = join(GIT_ROOT_DIR, authRes.ownerId.toString(), repoInfo.name);
                        handlePOSTService(parsedService, req, res, repoPath);
                    }
                });

                return;
            }
            else
            {
                res.status(405);
                res.setHeader("Content-Type", "text/plain");
                res.end(`unsupported method ${req.method}`);
                return;
            }
        }

        next();
    }
}
