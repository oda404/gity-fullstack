import { createGzip, createDeflate } from "zlib";
import { EncodingFunction, Encodings } from "./encodings";

export function createEncoder(enc: Encodings): EncodingFunction
{
    switch(enc)
    {
    case "gzip":    return createGzip();
    case "deflate": return createDeflate();
    }
}
