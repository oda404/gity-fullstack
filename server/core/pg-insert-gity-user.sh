#!/usr/bin/node

const argon2 = require("argon2");
const pass = require("./src/entities/user/password");
const consts = require("./src/pg/consts");
const logging = require("./src/logging");
const pg = require("pg");

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const db = consts.PG_DB_MAIN;

async function main()
{
    const pgClient = new pg.Client({
        host: consts.PG_HOST,
        port: consts.PG_PORT,
        database: db,
        user,
        password: DB_PASS
    });
    pgClient.connect().then( async () => {

        console.log(
            `Inserting ${logging.magenta("gity")} user for ${logging.yellow("DB")} ${logging.magenta(`${db}`)} into ${logging.yellow("table")} ${logging.magenta("users")} as ${logging.yellow("user")} ${logging.magenta(`${user}`)}...`
        );

        readline.question(`Password: `, async (ans) => {
            const hash = await pass.hashPassword(ans);

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
                process.exit();
            }

            console.log(`${logging.green("Done.")}`);
            
            pgClient.end();
            process.exit();
        });
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit();
    });
}

main().catch( err => console.error(err) );