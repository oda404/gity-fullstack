#!/bin/node

const migrations = require('./src/pg/migrations');
const pg = require('pg');
const getPGConfig = require("gity-core/config-engine").getPGConfig;
const logging = require("gity-core/logging");

const pgConfig = getPGConfig();

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;

async function main()
{
    const pgClient = new pg.Client({
        host: pgConfig.host,
        port: pgConfig.port,
        user,
        password: DB_PASS
    });
    pgClient.connect().then( async () => {

        console.log(`Running databases...`);
        try
        {
            await migrations.runDatabases(pgClient);   
        } catch (e) {
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
