import { Request, Response } from "express";
import { Session } from "express-session";
import { User } from "./api/entities/User";

export type ApolloContext =
{
    req: Request & { session: Session & { userId?: number } };
    res: Response;
    // args for middlewares to inject into resolvers
    user?: User;
};
