import { Response } from "express";

export function setHeaderNoCache(res: Response): void
{
    res.setHeader("Expires", "Fri, 01 Jan 1980 00:00:00 GMT")
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Cache-Control", "no-cache, max-age=0, must-revalidate");
}
