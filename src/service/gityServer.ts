// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { Request, Response } from "express";
import gityService = require("./gityService");
import { tryAuthenticate, AuthResponses } from "./authentication";
import { join } from "path";
import { access } from "fs";
import { Connection } from "typeorm";

export const rootGitDir: string = "/home/oda/Documents/git/";
let verbose = true;

function getRepoPath(reqURL: string): string
{
    if(reqURL.length < 1)
    {
        return "";
    }
    /* repo path is of format <userName>/<repoName> */
    let repoName = reqURL.substring(1, reqURL.indexOf('/', reqURL.indexOf('/', 1) + 1));

    return join(rootGitDir, repoName);
}

function handleResponse(req: Request, res: Response, repoPath: string, service: string, dbCon: Connection): void
{
    if(req.method === "GET")
    {
        tryAuthenticate(req, res, repoPath, dbCon).then((val) => {
            if(val === AuthResponses.GOOD)
            {
                gityService.handleGETService(service, res, repoPath);
            }
        });
    }
    else if(req.method === "POST")
    {
        tryAuthenticate(req, res, repoPath, dbCon).then((val) => {
            if(val === AuthResponses.GOOD)
            {
                gityService.handlePOSTService(service, req, res, repoPath);
            }
        });
    }
}

export function requestHandler(req: Request, res: Response, service: string, dbCon: Connection): void
{
    let repoPath = getRepoPath(String(req.url));

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
            handleResponse(req, res, repoPath, service, dbCon);
        }
    });
}
