#!/usr/bin/node

const migrations = require('./src/pg/migrations');
const consts = require("./src/pg/consts");
const pg = require('pg');
const logging = require("./src/logging");

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;

async function main()
{
    const pgClient = new pg.Client({
        host: consts.PG_HOST,
        port: consts.PG_PORT,
        user,
        password: DB_PASS
    });
    pgClient.connect().then( async () => {

        console.log(`Running databases as ${logging.yellow("user")} ${logging.magenta(`${user}`)}...`);
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
