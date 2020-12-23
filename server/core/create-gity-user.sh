#!/usr/bin/node

const argon2 = require("argon2");
const pass = require("./src/entities/user/password");
const pg = require("pg");

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
        console.log("Creating gity user...");

        const hash = await pass.hashPassword(process.env.PASS);

        await pgClient.query(`
            INSERT INTO users(
                "username",
                "email",
                "invitedBy",
                "hash"
            ) VALUES(
                'gity',
                'gity@gity.com',
                '1',
                '${hash}'
            );
        `);

        console.log("Done.");
        pgClient.end();
        process.exit();
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit();
    });
}

main().catch( err => console.error(err) );