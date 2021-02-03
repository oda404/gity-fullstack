
import { Request, Response } from "express";
import { spawn } from "child_process";
import { getEncoding } from "../utils/getEncoding";
import { createEncoder } from "../utils/encoder";
import { createDecoder } from "../utils/decoder";
import { UPLOAD_PACK_TIMEOUT_S } from "../consts";

export function handlePOSTService(
    service: string, 
    req: Request, 
    targetRes: Response, 
    repoPath: string
): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-result`);
    const acceptedEncoding = getEncoding(
        req.headers["accept-encoding"] as string | undefined
    );
    const contentEncoding = getEncoding(
        req.headers["content-encoding"] as string | undefined
    )

    const argv = [
        "--stateless-rpc", 
        repoPath 
    ];
    if(service === "git-upload-pack")
    {
        argv.push("--timeout");
        argv.push(UPLOAD_PACK_TIMEOUT_S.toString());
    }

    const proc = spawn(service, argv);

    if(contentEncoding !== undefined)
    {
        req.pipe(createDecoder(contentEncoding))
           .pipe(proc.stdin);
    }
    else
    {
        req.pipe(proc.stdin);
    }

    if(acceptedEncoding !== undefined)
    {
        targetRes.setHeader("Content-Encoding", acceptedEncoding);

        proc.stdout
            .pipe(createEncoder(acceptedEncoding))
            .pipe(targetRes);
    }
    else
    {
        proc.stdout.pipe(targetRes);
    }
}
