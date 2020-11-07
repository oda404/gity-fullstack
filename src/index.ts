import "reflect-metadata";
import { __prod__, __port__, __db_pass__ } from "./consts";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createConnection } from "typeorm";
import { join } from "path"
import { exit } from "process";
import { ApolloContext } from "./types";

async function main(): Promise<void>
{
    const con = await createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        database: "test",
        synchronize: !__prod__,
        logging: !__prod__,
        username: "postgres",
        password: __db_pass__,
        entities: [
            join(__dirname, "entities/**/*.js")
        ]
    });

    if(con.isConnected)
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
                PostResolver,
                UserResolver
            ],
            validate: false
        }),
        context: (): ApolloContext => ({ con: con })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(__port__, () => {
        console.log(`server started on port ${__port__}`);
    });
}

main().catch(err => console.error(err));
