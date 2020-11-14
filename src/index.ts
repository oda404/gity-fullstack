import "reflect-metadata";
import { __prod__, __port__, __db_pass__ } from "./consts";
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
        console.log("db connection established");
    }
    else
    {
        console.error("db connection failed. aborting");
        exit();
    }

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
        context: (): ApolloContext => ({ con: dbCon })
    });

    app.use(baseMiddleware);
    apolloServer.applyMiddleware({ app });

    app.listen(__port__, () => {
        console.log(`server started on port ${__port__}`);
    });
}

main().catch(err => console.error(err));
