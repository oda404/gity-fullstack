
import { Response } from "express";
import { spawn } from "child_process";
import { pack } from "./pack";

export function handleGETService(
    service: string, 
    targetRes: Response, 
    repoPath: string
): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-advertisement`);

    targetRes.write(pack(`# service=${service}\n`) + "0000");

    spawn(service, [ 
        "--stateless-rpc", 
        "--advertise-refs", 
        repoPath 
    ]).stdout.pipe(targetRes);
}
