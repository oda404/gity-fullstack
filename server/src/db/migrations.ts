import { Client } from "pg";
import { __prod__ } from "../consts";
import { EMAIL_MAX_LENGTH, REPO_NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "./conts";

const CREATE_USERS_TABLE_QUERY = `\
    CREATE TABLE users(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "username" VARCHAR(${USERNAME_MAX_LENGTH}) UNIQUE NOT NULL,\
        "email" VARCHAR(${EMAIL_MAX_LENGTH}) UNIQUE NOT NULL,\
        "isEmailVerified" BOOLEAN DEFAULT FALSE,\
        "hash" TEXT NOT NULL,\
        "reposId" BIGINT[] DEFAULT '{}',\
        "aliveSessions" TEXT[] DEFAULT '{}'\
    );`;

const CREATE_REPOS_TABLE_QUERY = `\
    CREATE TABLE repos(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "name" VARCHAR(${REPO_NAME_MAX_LENGTH}) NOT NULL,\
        "owner" VARCHAR(${USERNAME_MAX_LENGTH}) NOT NULL,\
        "description" VARCHAR(100) DEFAULT 'No description provided.',\
        "likes" INT DEFAULT 0,\
        "private" BOOLEAN DEFAULT FALSE\
    );`;

/*  */
export function runMigrations(client: Client): void
{
    if(!__prod__)
    {
        client.query(CREATE_USERS_TABLE_QUERY);
        client.query(CREATE_REPOS_TABLE_QUERY);
    }
}
