import express from "express"
import { Client } from "pg";
import { exit } from "process";
import { DB_PASS, SERVER_PORT } from "./consts";
import { gitService } from "./service";
import { logInfo, logErr, printServerInfo } from "./utils/logging";

async function main()
{
    printServerInfo();

    const pgClient = new Client({
        host: "192.168.0.59",
        port: 5432,
        database: "gity",
        user: "gity",
        password: DB_PASS,
    });
    pgClient.connect().then( async () => {
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
