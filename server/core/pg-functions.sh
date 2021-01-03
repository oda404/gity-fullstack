#!/usr/bin/node

const functions = require("./src/pg/functions");
const consts = require("./src/pg/consts");
const pg = require('pg');
const logging = require("./src/logging");

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;

const db = consts.PG_DB_MAIN;

async function main()
{
    const pgClient = new pg.Client({
        host: consts.PG_HOST,
        port: consts.PG_PORT,
        database: db,
        user,
        password: DB_PASS,
    });

    pgClient.connect().then( async () => {

        console.log(`Running functions for ${logging.yellow("DB")} ${logging.magenta(`${db}`)} as ${logging.yellow("user")} ${logging.magenta(`${user}`)}...`);
        try
        {
            await functions.runFunctions(pgClient);
        } catch(e) {
            console.error(e);
            pgClient.end();
            process.exit(1);
        }
        console.log(`${logging.green("Done.")}`);
        
        pgClient.end();
        process.exit();
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit(1);
    });
}

main().catch( err => console.error(err) );
