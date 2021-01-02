
import { Client } from "pg";
import { PG_DB_MAIN, USERNAME_TYPE, EMAIL_TYPE, REPO_NAME_TYPE, REPO_DESCRIPTION_TYPE } from "./consts";

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
    for(let i = 0; i < DATABASES.length; ++i)
    {
        await client.query(DATABASES[i]);
    }
}

export async function runMigrations(client: Client): Promise<void>
{
    for(let i = 0; i < TABLES.length; ++i)
    {
        await client.query(TABLES[i]);
    }
}

export async function runConstraints(client: Client): Promise<void>
{
    for(let i = 0; i < CONSTRAINTS.length; ++i)
    {
        await client.query(CONSTRAINTS[i]);
    }
}
