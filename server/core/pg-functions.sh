#!/bin/node

const functions = require("./src/pg/functions");
const pg = require('pg');
const getPGConfig = require("gity-core/config-engine").getPGConfig;
const logging = require("gity-core/logging");

const pgConfig = getPGConfig();

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;
const db = pgConfig.databases.find(db => db.alias === "main").name;

async function main()
{
    const pgClient = new pg.Client({
        host: pgConfig.hostname,
        port: pgConfig.port,
        database: db,
        user,
        password: DB_PASS,
    });

    pgClient.connect().then( async () => {

        console.log(`Running functions...`);
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
