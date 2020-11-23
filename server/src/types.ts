import { Connection } from "typeorm";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

export type ApolloContext =
{
    pgCon: Connection;
    redisClient: Redis;
    req: Request & { session: Session & { userId?: string } };
    res: Response;
}