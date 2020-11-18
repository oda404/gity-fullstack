import "reflect-metadata";
import { __prod__, __port__, __db_pass__, __session_secret__ } from "./consts";
import { Request, Response } from "express";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./api/resolvers/user";
import { RepoResolver } from "./api/resolvers/repo";
import { Connection, createConnection } from "typeorm";
import { join } from "path"
import { exit } from "process";
import { ApolloContext } from "./types";
import { parse } from "url";
import { isServiceValid } from "./service/gityService";
import { requestHandler } from "./service/gityServer";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
import { logInfo, logErr } from "./utils";
import cors from "cors";

let dbCon: Connection;

function baseMiddleware(req: Request, res: Response, next: any)
{
    // check if request is coming from a git client
    let parsedService = "";
    if(req.method === "GET")
    {
        const queries = parse(String(req.url), true);
        parsedService = String(queries.query["service"]);
    }
    else if(req.method === "POST")
    {
        parsedService = String(req.url?.substring(req.url.lastIndexOf('/') + 1));
    }

    if(isServiceValid(parsedService))
    {
        requestHandler(req, res, parsedService, dbCon);
        return;
    }

    next();
}

async function main(): Promise<void>
{
    dbCon = await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "gity",
        synchronize: !__prod__,
        logging: !__prod__, 
        username: "gity",
        password: __db_pass__ || "pass",
        entities: [
            join(__dirname, "api/entities/**/*.js")
        ]
    });

    if(dbCon.isConnected)
    {
        logInfo("PostgreSQL connection established");
    }
    else
    {
        logErr("PostgreSQL connection failed. aborting...");
        exit();
    }

    const RedisStore = connectRedis(session);
    const redisClient = createClient();
    
    redisClient.on("ready", () => {
        logInfo("Redis connection established");
    });

    redisClient.on("error", (message) => {
        logErr(message);
    });

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver,
                RepoResolver
            ],
            validate: false
        }),
        playground: !__prod__,
        context: ({ req, res }): ApolloContext => ({ con: dbCon, req: req, res: res })
    });

    app.use(baseMiddleware);
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        }
    ));
    app.use(
        session({
            name: "ass",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true // doesn't renew cookie expiry date when user interacts with the session
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7, // one week
                httpOnly: true,
                sameSite: "strict", // only send cookies if on the same site
                secure: __prod__
            },
            secret: __session_secret__ || "secret",
            resave: false,
            saveUninitialized: false
        })
    );
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(__port__, () => {
        logInfo(`Server started on port ${__port__}`);
    });
}

main().catch(err => console.error(err));
