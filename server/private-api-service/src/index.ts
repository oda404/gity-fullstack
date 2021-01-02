import "reflect-metadata";
import {
    __prod__,
    PG_PASS,
    PG_USER,
    SERVER_PORT,
    SESSION_COOKIE_NAME,
    SESSION_SECRET,
    PG_HOST,
    PG_PORT,
    PG_DB_MAIN,
    RD_PORT,
    RD_HOST
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
import { createTestAccount, createTransport } from "nodemailer";
import { Container } from "typedi";
import { Client } from "pg";
import { runPreparedStatements } from "../../core/src/pg/prepares";
import { green, logErr, logInfo, magenta, initLogging } from "../../core/src/logging";

export function printServerInfo(): void
{
    if(__prod__)
    {
        logInfo(`Server is running in ${magenta("PRODUCTION")} ${green("mode on")} ${magenta(`PORT ${SERVER_PORT}!`)}`);
    }
    else
    {
        logInfo(`Server is running in ${magenta("DEVELOPMENT")} ${green("mode on")} ${magenta(`PORT ${SERVER_PORT}!`)}`);
    }

    console.log();
}

async function main(): Promise<void>
{
    initLogging("[PRIVATE_API]");
    printServerInfo();
    let pgClient = new Client({
        host: PG_HOST,
        port: PG_PORT,
        database: PG_DB_MAIN,
        user: PG_USER,
        password: PG_PASS,
    });
    pgClient.connect().then( async () => {
        await runPreparedStatements(pgClient);
        logInfo("PostgreSQL connection established");
    }).catch(() => {
        logErr("PostgreSQL connection failed. aborting...");
        exit();
    });

    const RedisStore = connectRedis(session);
    const redisClient = new Redis({
        host: RD_HOST,
        port: RD_PORT
    });
    
    redisClient.on("ready", () => {
        logInfo("Redis connection established");
    });

    redisClient.on("error", (message) => {
        if(message.errno === -3008 /* couldn't connect */)
        {
            logErr("Redis connection failed. aborting...");
            pgClient.end();
            exit();
        }

        logErr(message);
    });

    let mailTransporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "htucl6fvuvgxdfgo@ethereal.email",
            pass: "ZwesZCREerPdkGv9UH"
        }
    });

    Container.set("pgClient", pgClient);
    Container.set("redisClient", redisClient);
    Container.set("mailTransporter", mailTransporter);

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
            origin: "http://localhost:3000",
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
            saveUninitialized: false
        })
    );
    apolloServer.applyMiddleware({ app, cors: false, path: "/api/private" });

    app.listen(SERVER_PORT);
}

main().catch(err => console.error(err));
