import "reflect-metadata";
import {
    __prod__,
    DB_PASS,
    SERVER_PORT,
    SESSION_COOKIE_NAME,
    SESSION_SECRET
} from "./consts";
import { RequestHandler } from "express";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, ResolverData } from "type-graphql";
import { UserResolver } from "./api/resolvers/user";
import { RepoResolver } from "./api/resolvers/repo";
import { exit } from "process";
import { ApolloContext } from "./types";
import { parse } from "url";
import { isServiceValid } from "./gitService/gityService";
import { requestHandler } from "./gitService/gityServer";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { logInfo, logErr } from "./utils";
import cors from "cors";
import { customAuthChecker } from "./utils/authChecker";
import { createTransport } from "nodemailer";
import { Container } from "typedi";
import { Client } from "pg";
import { runMigrations } from "./db/migrations";
import { initDB } from "./db/init";

function baseMiddleware(pgClient: Client): RequestHandler
{
    return (req, res, next) => {
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
            requestHandler(req, res, parsedService, pgClient);
            return;
        }

        next();
    }
}

async function main(): Promise<void>
{
    let pgClient = new Client({
        host: "localhost",
        port: 5432,
        database: "gity",
        user: "gity",
        password: DB_PASS,
    });
    pgClient.connect().then( async () => {
        //runMigrations(pgClient);
        initDB(pgClient);

        logInfo("PostgreSQL connection established");
        Container.set("pgClient", pgClient);
    }).catch(() => {
        logErr("PostgreSQL connection failed. aborting...");
        exit();
    });

    const RedisStore = connectRedis(session);
    const redisClient = new Redis();
    
    redisClient.on("ready", () => {
        logInfo("Redis connection established");
        Container.set("redisClient", redisClient);
    });

    redisClient.on("error", (message) => {
        logErr(message);
    });

    let mailTransporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "xi4sevkyi3agmrie@ethereal.email",
            pass: "bbmESj8ZW8RCsPu9Md"
        }
    });

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

    app.use(baseMiddleware(pgClient));
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
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(SERVER_PORT, () => {
        logInfo(`Server started on port ${SERVER_PORT}`);
    });
}

main().catch(err => console.error(err));
