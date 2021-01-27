import "reflect-metadata";
import "dotenv-safe/config";
import {
    __prod__,
    PG_PASS,
    PG_USER,
    SERVER_PORT,
    SESSION_COOKIE_NAME,
    SESSION_SECRET,
    PG_HOSTNAME,
    PG_PORT,
    PG_DB_MAIN,
    RD_PORT,
    RD_HOSTNAME,
    FRONTEND_HOSTNAME
} from "./consts";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, ResolverData } from "type-graphql";
import { UserResolver } from "./api/resolvers/user";
import { RepoResolver } from "./api/resolvers/repo";
import { exit } from "process";
import { ApolloContext } from "./types";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { customAuthChecker } from "./utils/authChecker";
import { Container } from "typedi";
import { Client } from "pg";
import { runPreparedStatements } from "gity-core/pg-prepares";
import { green, logErr, logInfo, magenta } from "gity-core/logging";
import { v4 as genuuidV4 } from "uuid";
import { createServer } from "http";

async function main(): Promise<void>
{
    let pgClient = new Client({
        host: PG_HOSTNAME,
        port: PG_PORT,
        database: PG_DB_MAIN,
        user: PG_USER,
        password: PG_PASS,
    });
    pgClient.connect().then( async () => {
        await runPreparedStatements(pgClient);
        logInfo(`${magenta("PostgreSQL")} ${green("connection established")}`);
    }).catch(() => {
        logErr("PostgreSQL connection failed. aborting...");
        exit(1);
    });

    const RedisStore = connectRedis(session);
    const redisClient = new Redis({
        host: RD_HOSTNAME,
        port: RD_PORT
    });
    
    redisClient.on("ready", () => {
        logInfo(`${magenta("Redis")} ${green("connection established")}`);
    });

    redisClient.on("error", (message) => {
        if(message.errno === -3008 /* couldn't connect */)
        {
            logErr("Redis connection failed. aborting...");
            pgClient.end();
            exit(2);
        }

        logErr(message);
    });

    Container.set("pgClient", pgClient);
    Container.set("redisClient", redisClient);

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver,
                RepoResolver
            ],
            validate: false,
            authChecker: customAuthChecker,
            authMode: "null",
            container: Container
        }),
        playground: !__prod__,
        context: ({ req, res }): ApolloContext => ({ req, res })
    });

    app.use(
        cors({
            origin: FRONTEND_HOSTNAME,
            credentials: true
        })
    );
    app.use(
        session({
            name: SESSION_COOKIE_NAME,
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
            secret: SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            genid: () => {
                /* since this stupid fucking function can t be async
                I can t verify if the uuid exists in redis 
                so i m appending 2 v4 uuids together so there
                is *no* chance of them colliding */
                return `${genuuidV4()}-${genuuidV4()}`;
            }
        })
    );
    apolloServer.applyMiddleware({ app, cors: false, path: "/" });

    const httpServer = createServer(app);
    httpServer.listen(SERVER_PORT, () => {
        logInfo(`Running in ${__prod__ ? magenta("PRODUCTION") : magenta("DEVELOPMENT")} ${green("mode.")}`);
        logInfo(`Listening on port ${magenta(`${SERVER_PORT}`)}`);
    });
}

main().catch(err => console.error(err));
