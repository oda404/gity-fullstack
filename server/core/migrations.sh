#!/usr/bin/node

const migrations = require('./src/pg/migrations');
const functions = require("./src/pg/functions");
const pg = require('pg');

const DB_PASS = process.env.DB_PASS || "pass";

async function main()
{
    const pgClient = new pg.Client({
        host: "192.168.0.59",
        port: 5432,
        database: "gity",
        user: "gity",
        password: DB_PASS,
    });
    pgClient.connect().then( async () => {
        console.log("Running migrations...");
        await migrations.runMigrations(pgClient);
        console.log("Done.");
        pgClient.end();
        process.exit();
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit();
    });
}

main().catch( err => console.error(err) );
