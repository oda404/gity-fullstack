import { Deflate, Gzip } from "zlib"

export type Encodings = "gzip" | "deflate";
export type EncodingFunction = Gzip | Deflate;
