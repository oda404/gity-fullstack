import { Encodings } from "./encodings";


export function getEncoding(
    header: string | undefined
): Encodings | undefined
{
    if(header === undefined) return undefined;
    
    if(header.indexOf("gzip") > -1)
    {
        return "gzip";
    }
    
    if(header.indexOf("deflate") > -1)
    {
        return "deflate";
    }

    return undefined;
}
