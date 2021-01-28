#!/bin/node

const hashPassword = require("argon2").hash;
const pg = require("pg");
const getPGConfig = require("gity-core/config-engine").getPGConfig;
const getUserConfig = require("gity-core/config-engine").getUserConfig;
const logging = require("gity-core/logging");

const pgConfig = getPGConfig();
const userConfig = getUserConfig();

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;
const db = pgConfig.databases.find(db => db.alias === "main").name;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main()
{
    const pgClient = new pg.Client({
        host: pgConfig.hostname,
        port: pgConfig.port,
        database: db,
        user,
        password: DB_PASS
    });
    pgClient.connect().then( async () => {

        console.log(
            `Inserting ${logging.magenta("gity")} user...`
        );

        readline.question(`Password: `, async (ans) => {

            const hash = await hashPassword(ans, {
                saltLength: userConfig.passwdHashSaltLen,
                timeCost: userConfig.passwdHashTimeCost
            });

            try
            {
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
            } catch(e) {
                console.error(e);
                pgClient.end();
                process.exit(1);
            }

            console.log(`${logging.green("Done.")}`);
            
            pgClient.end();
            process.exit();
        });
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit(1);
    });
}

main().catch( err => console.error(err) );
