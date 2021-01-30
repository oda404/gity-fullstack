
import { Request, Response } from "express";
import { spawn } from "child_process";

export function handlePOSTService(
    service: string, 
    req: Request, 
    targetRes: Response, 
    repoPath: string
): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-result`);

    const proc = spawn(service, [ 
        "--stateless-rpc", 
        repoPath 
    ]);
    req.pipe(proc.stdin);
    proc.stdout.pipe(targetRes);
}
