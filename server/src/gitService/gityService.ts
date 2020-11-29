// Copyright (c) Olaru Alexandru <xdxalexandru404@gmail.com>
// Licensed under the MIT license found in the LICENSE file in the root of this repository.

import { Request, Response } from "express";
import { spawn } from "child_process";

function pack(message: string): string
{
    let n = (4 + message.length).toString(16);
    return Array(4 - n.length + 1).join('0') + n + message;
}

const validServices = [ "git-upload-pack", "git-receive-pack" ];

export function isServiceValid(service: string): boolean
{
    return !(validServices.indexOf(service) === -1)
}

export function handleGETService(service: string, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-type", `application/x-${service}-advertisement`);

    targetRes.write(pack(`# service=${service}\n`) + "0000");

    spawn(service, [ "--stateless-rpc", "--advertise-refs", repoPath ]).stdout.pipe(targetRes);
}

export function handlePOSTService(service: string, req: Request, targetRes: Response, repoPath: string): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-type", `application/x-${service}-result`);

    const proc = spawn(service, [ "--stateless-rpc", repoPath ]);
    req.pipe(proc.stdin);
    proc.stdout.pipe(targetRes);
}
