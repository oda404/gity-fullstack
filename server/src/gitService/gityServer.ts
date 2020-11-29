// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { Request, Response } from "express";
import gityService = require("./gityService");
import { tryAuthenticate, AuthResponses } from "./authentication";
import { access } from "fs";
import { Client } from "pg";
import { getGitRepoPathFromURL } from "./utils";

let verbose = true;

function handleResponse(req: Request, res: Response, repoPath: string, service: string, pgClient: Client): void
{
    if(req.method === "GET")
    {
        tryAuthenticate(req, res, repoPath, pgClient).then((val) => {
            if(val === AuthResponses.GOOD)
            {
                gityService.handleGETService(service, res, repoPath);
            }
        });
    }
    else if(req.method === "POST")
    {
        tryAuthenticate(req, res, repoPath, pgClient).then((val) => {
            if(val === AuthResponses.GOOD)
            {
                gityService.handlePOSTService(service, req, res, repoPath);
            }
        });
    }
    else
    {
        res.status(401);
        res.end();
    }
}

export function requestHandler(req: Request, res: Response, service: string, pgClient: Client): void
{
    let repoPath = getGitRepoPathFromURL(String(req.url));

    if(verbose)
    {
        console.info(`Got [${req.method}] request from [${req.connection.remoteAddress}] with url [${req.url}]`);
    }

    access(repoPath, err =>
    {
        res.setHeader("Cache-Control", "no-cache");

        if(err)
        {
            res.statusCode = 404;
            res.end("Repository not found.");
            if(verbose)
            {
                console.error(`Repository with path [${repoPath}] not found for [${req.connection.remoteAddress}]!`);
            }
            return;
        }
        else
        {
            handleResponse(req, res, repoPath, service, pgClient);
        }
    });
}
