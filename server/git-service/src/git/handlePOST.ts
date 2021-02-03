
import { Request, Response } from "express";
import { spawn } from "child_process";
import { getEncoding } from "../utils/getEncoding";
import { createEncoder } from "../utils/encoder";
import { EncodingFunction } from "../utils/encodings";
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
    );

    let decoder: EncodingFunction | undefined = undefined;
    if(contentEncoding !== undefined)
    {
        decoder = createDecoder(contentEncoding);
    }

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

    decoder === undefined ?
    req.pipe(proc.stdin)  :
    req.pipe(decoder).pipe(proc.stdin); 

    if(acceptedEncoding !== undefined)
    {
        const encoder = createEncoder(acceptedEncoding);
        targetRes.setHeader("Content-Encoding", acceptedEncoding);

        proc.stdout.pipe(encoder).pipe(targetRes);
    }
    else
    {
        proc.stdout.pipe(targetRes);
    }
}
