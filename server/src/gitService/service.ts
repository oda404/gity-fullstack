// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { Request, RequestHandler, Response } from "express";
import { spawn } from "child_process";
import { Container } from "typedi";
import { Client } from "pg";
import { getGitRepoPathFromURL } from "./utils";
import { access } from "fs";
import { tryAuthenticate, AuthResponses } from "./auth";
import { parse } from "url";

function pack(message: string): string
{
    let n = (4 + message.length).toString(16);
    return Array(4 - n.length + 1).join('0') + n + message;
}

const validServices = [ "git-upload-pack", "git-receive-pack" ];

function handleGETService(service: string, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-type", `application/x-${service}-advertisement`);

    targetRes.write(pack(`# service=${service}\n`) + "0000");

    spawn(service, [ "--stateless-rpc", "--advertise-refs", repoPath ]).stdout.pipe(targetRes);
}

function handlePOSTService(service: string, req: Request, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-type", `application/x-${service}-result`);

    const proc = spawn(service, [ "--stateless-rpc", repoPath ]);
    req.pipe(proc.stdin);
    proc.stdout.pipe(targetRes);
}

function isServiceValid(service: string): boolean
{
    return !(validServices.indexOf(service) === -1)
}

function handleRequest(req: Request, res: Response, service: string, pgClient: Client)
{
    const repoPath = getGitRepoPathFromURL(String(req.url));

    access(repoPath, err =>
    {
        res.setHeader("Cache-Control", "no-cache");

        if(err)
        {
            res.statusCode = 404;
            res.end("Repository not found.");
            return;
        }
        else
        {
            if(req.method === "GET")
            {
                tryAuthenticate(req, res, repoPath, pgClient).then( authRes => {
                    if(authRes === AuthResponses.GOOD)
                    {
                        handleGETService(service, res, repoPath);
                    }
                });
            }
            else if(req.method === "POST")
            {
                tryAuthenticate(req, res, repoPath, pgClient).then( authRes => {
                    if(authRes === AuthResponses.GOOD)
                    {
                        handlePOSTService(service, req, res, repoPath);
                    }
                });
            }
            else
            {
                res.status(401);
                res.end(`Unknown method ${req.method}`);
            }
        }
    });
}

export function gitService(): RequestHandler
{
    const pgClient = Container.get<Client>("pgClient");

    return (req, res, next) => {

        let parsedService = "";
        if(req.method === "GET")
        {
            const queries = parse(String(req.url), true);
            parsedService = String(queries.query["service"]);
        }
        else if(req.method === "POST")
        {
            parsedService = String(req.url?.substring(req.url.lastIndexOf('/') + 1));
        }

        if(isServiceValid(parsedService))
        {
            handleRequest(req, res, parsedService, pgClient);
            return;
        }

        next();
    }
}
