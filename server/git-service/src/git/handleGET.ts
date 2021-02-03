
import { Response, Request } from "express";
import { spawn } from "child_process";
import { pack } from "./pack";
import { getEncoding } from "../utils/getEncoding";
import { createEncoder } from "../utils/encoder";

export function handleGETService(
    service: string, 
    req: Request,
    targetRes: Response, 
    repoPath: string
): void
{
    targetRes.statusCode = 200;
    targetRes.setHeader("Content-Type", `application/x-${service}-advertisement`);
    
    const acceptedEncoding = getEncoding(
        req.headers["accept-encoding"] as string | undefined
    );

    const proc = spawn(service, [ 
        "--stateless-rpc", 
        "--advertise-refs", 
        repoPath 
    ]);

    if(acceptedEncoding !== undefined)
    {
        targetRes.setHeader("Content-Encoding", acceptedEncoding);
        const encoder = createEncoder(acceptedEncoding);
        
        encoder.write(pack(`# service=${service}\n`) + "0000");
        proc.stdout.pipe(encoder).pipe(targetRes);
    }
    else
    {
        targetRes.write(pack(`# service=${service}\n`) + "0000");
        proc.stdout.pipe(targetRes);
    }
}
