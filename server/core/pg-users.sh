#!/bin/node

const pg = require('pg');
const getPGConfig = require("gity-core/config-engine").getPGConfig;
const logging = require("gity-core/logging");

const pgConfig = getPGConfig();

const DB_PASS = process.env.DB_PASS;
const user = process.env.DB_ROOT_USER;
const db = pgConfig.databases.find(db => db.alias === "main").name;
const privateAPIUser = pgConfig.users.find(user => user.alias === "private-api").name;
const gitServiceUser = pgConfig.users.find(user => user.alias === "git-service").name;

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

        console.log(`Creating ${logging.yellow("PG user")} ${logging.magenta(`${privateAPIUser}`)}...`);
        readline.question(`Password: `, async (ans) => {
            try
            {
                await pgClient.query(`CREATE USER ${privateAPIUser} WITH PASSWORD '${ans}';`);
                await pgClient.query(`GRANT SELECT, INSERT, DELETE, UPDATE ON users TO ${privateAPIUser};`);
                await pgClient.query(`GRANT SELECT, INSERT, DELETE, UPDATE ON repos TO ${privateAPIUser};`);
            } catch(e) {
                console.error(e);
                pgClient.end();
                process.exit(1);
            }
            console.log(`${logging.green("Done.")}`);

            console.log();

            console.log(`Creating ${logging.yellow("PG user")} ${logging.magenta(`${gitServiceUser}`)}...`);
            readline.question(`Password: `, async (_ans) => {
                try
                {
                    await pgClient.query(`CREATE USER ${gitServiceUser} WITH PASSWORD '${_ans}';`);
                    await pgClient.query(`GRANT SELECT ON repos TO ${gitServiceUser};`);
                    await pgClient.query(`GRANT SELECT ON users TO ${gitServiceUser};`);
                } catch(e) {
                    console.error(e);
                    pgClient.end();
                    process.exit(1);
                }
                console.log(`${logging.green("Done.")}`);

                pgClient.end();
                process.exit();
            });
        });
    }).catch(() => {
        console.error("PostgreSQL connection failed. aborting...");
        process.exit(1);
    });
}

main().catch( err => console.error(err) );
