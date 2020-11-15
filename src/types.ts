import { Connection } from "typeorm";
import { Request, Response } from "express";
import { Session } from "express-session";

export type ApolloContext =
{
    con: Connection;
    req: Request & { session: Session & { userId?: string } };
    res: Response;
}