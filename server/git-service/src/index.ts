import "dotenv-safe/config";
import express from "express";
import { Client } from "pg";
import { exit } from "process";
import { createServer } from "http";
import { 
    PG_USER, 
    PG_PASS, 
    PG_DB_MAIN, 
    PG_PORT, 
    PG_HOSTNAME, 
    SERVER_PORT, 
    PROD 
} from "./consts";
import { gitService } from "./service";
import { runPreparedStatements } from "gity-core/pg-prepares";
import { green, logErr, logInfo, magenta } from "gity-core/logging";

async function main()
{
    const pgClient = new Client({
        host: PG_HOSTNAME,
        port: PG_PORT,
        database: PG_DB_MAIN,
        user: PG_USER,
        password: PG_PASS,
    });
    pgClient.connect().then( async () => {
        await runPreparedStatements(pgClient);
        logInfo(`${magenta("PostgreSQL")} ${green("connection established")}.`);
    }).catch(() => {
        logErr("PostgreSQL connection failed. aborting...");
        exit();
    });

    const APP = express();

    APP.use(gitService(pgClient));

    const server = createServer(APP);

    server.listen(SERVER_PORT, () => {
        logInfo(`Running in ${PROD ? magenta("PRODUCTION") : magenta("DEVELOPMENT")} ${green("mode.")}`);
        logInfo(`Listening on port ${magenta(`${SERVER_PORT}`)}.`);
    });
}

main().catch(err => logErr(err));
