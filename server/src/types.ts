import { Connection } from "typeorm";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import Mail from "nodemailer/lib/mailer";
import { User } from "./api/entities/User";

export type ApolloContext =
{
    pgCon: Connection;
    redisClient: Redis;
    mailTransporter: Mail;
    req: Request & { session: Session & { userId?: string } };
    res: Response;

    // args for middlewares to inject into resolvers
    user?: User;
};
