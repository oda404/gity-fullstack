import express from "express"
import { Client } from "pg";
import { exit } from "process";
import { DB_PASS, GIT_ROOT_DIR, SERVER_PORT, __prod__ } from "./consts";
import { gitService } from "./service";
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

    logInfo(`${magenta("GIT_ROOT_DIR")} ${green("is")} ${magenta(`${GIT_ROOT_DIR}`)}`);

    console.log();
}

async function main()
{
    initLogging("[GIT_SERVICE]");
    printServerInfo();

    const pgClient = new Client({
        host: "192.168.0.59",
        port: 5432,
        database: "gity",
        user: "gity",
        password: DB_PASS,
    });
    pgClient.connect().then( async () => {
        await runPreparedStatements(pgClient);
        logInfo("PostgreSQL connection established");
    }).catch(() => {
        logErr("PostgreSQL connection failed. aborting...");
        exit();
    });

    const APP = express();

    APP.use(gitService(pgClient));

    APP.listen(SERVER_PORT);
}

main().catch(err => logErr(err));
