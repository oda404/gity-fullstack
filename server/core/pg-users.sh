#!/usr/bin/node

const consts = require("./src/pg/consts");
const pg = require('pg');
const logging = require("./src/logging");

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main()
{
    const pgClient = new pg.Client({
        host: consts.PG_HOST,
        port: consts.PG_PORT,
        user,
        password: DB_PASS
    });
    pgClient.connect().then( async () => {

        console.log(`Creating ${logging.yellow("PG user")} ${logging.magenta(`${consts.PG_USER_PRIVATE_API}`)}...`);
        readline.question(`Password: `, async (ans) => {
            try
            {
                await pgClient.query(`CREATE USER ${consts.PG_USER_PRIVATE_API} WITH PASSWORD '${ans}';`);
            } catch(e) {
                console.error(e);
                pgClient.end();
                process.exit();
            }
            console.log(`${logging.green("Done.")}`);

            console.log();

            console.log(`Creating ${logging.yellow("PG user")} ${logging.magenta(`${consts.PG_USER_GIT_SERVICE}`)}...`);
            readline.question(`Password: `, async (_ans) => {
                try
                {
                    await pgClient.query(`CREATE USER ${consts.PG_USER_GIT_SERVICE} WITH PASSWORD '${_ans}';`);   
                } catch(e) {
                    console.error(e);
                    pgClient.end();
                    process.exit();
                }
                console.log(`${logging.green("Done.")}`);

                pgClient.end();
                process.exit();
            });
        });
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit();
    });
}

main().catch( err => console.error(err) );
