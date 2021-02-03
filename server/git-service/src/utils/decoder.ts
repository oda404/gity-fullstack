import { createGunzip, createInflate } from "zlib";
import { EncodingFunction, Encodings } from "./encodings";

export function createDecoder(enc: Encodings): EncodingFunction
{
    switch(enc)
    {
    case "gzip":    return createGunzip();
    case "deflate": return createInflate();
    }
}
