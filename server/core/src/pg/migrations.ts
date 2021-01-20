
import { Client } from "pg";
import { getUserConfig, getRepoConfig } from "gity-core/config-engine";
import { getPGConfig } from "../../modules/gity-core/config-engine";

const userConfig = getUserConfig();
const repoConfig = getRepoConfig();
const pgConfig = getPGConfig();

const USERNAME_TYPE = `varchar(${userConfig.usernameMaxLen})`;
const EMAIL_TYPE = `varchar(${userConfig.emailMaxLen})`;
const REPO_NAME_TYPE = `varchar(${repoConfig.nameMaxLen})`;
const REPO_DESCRIPTION_TYPE = `varchar(${repoConfig.descriptionMaxLen})`;
const PG_DB_MAIN = pgConfig.databases.find(db => db.alias === "main")?.name;

const DATABASES = [
    `CREATE DATABASE ${PG_DB_MAIN};`,
];

const TABLES = [
    `CREATE TABLE users(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "username" ${USERNAME_TYPE} UNIQUE NOT NULL,\
        "email" ${EMAIL_TYPE} UNIQUE NOT NULL,\
        "isEmailVerified" BOOLEAN DEFAULT FALSE,\
        "invitedBy" BIGINT,
        "hash" TEXT NOT NULL,\
        "aliveSessions" TEXT[] DEFAULT '{}'\
    );`,

    `CREATE TABLE repos(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "name" ${REPO_NAME_TYPE} NOT NULL,\
        "ownerId" BIGINT REFERENCES "users"("id") ON DELETE CASCADE,\
        "description" ${REPO_DESCRIPTION_TYPE} DEFAULT 'No description provided.',\
        "likes" INT DEFAULT 0,\
        "isPrivate" BOOLEAN DEFAULT FALSE\
    );`
];

const CONSTRAINTS = [
    "ALTER TABLE repos ADD CONSTRAINT UNIQUE_ownerId_name UNIQUE(\"name\", \"ownerId\");",
];

export async function runDatabases(client: Client): Promise<void>
{
    for(let i in DATABASES)
    {
        await client.query(DATABASES[i]);
    }
}

export async function runMigrations(client: Client): Promise<void>
{
    for(let i in TABLES)
    {
        await client.query(TABLES[i]);
    }
}

export async function runConstraints(client: Client): Promise<void>
{
    for(let i in CONSTRAINTS)
    {
        await client.query(CONSTRAINTS[i]);
    }
}
