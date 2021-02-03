
import { Request, Response } from "express";
import { spawn } from "child_process";
import { getEncoding } from "../utils/getEncoding";
import { createEncoder } from "../utils/encoder";
import { EncodingFunction } from "../utils/encodings";
import { createDecoder } from "../utils/decoder";

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

    const proc = spawn(service, [ 
        "--stateless-rpc", 
        repoPath 
    ]);

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
