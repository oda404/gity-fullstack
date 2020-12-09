import { Client } from "pg";
import { __prod__ } from "../consts";
import { USERNAME_TYPE, EMAIL_TYPE, REPO_NAME_TYPE, REPO_DESCRIPTION_TYPE } from "./conts";

const CREATE_USERS_TABLE_QUERY = `\
    CREATE TABLE users(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "username" ${USERNAME_TYPE} UNIQUE NOT NULL,\
        "email" ${EMAIL_TYPE} UNIQUE NOT NULL,\
        "isEmailVerified" BOOLEAN DEFAULT FALSE,\
        "hash" TEXT NOT NULL,\
        "repos" ${USERNAME_TYPE}[] DEFAULT '{}',\
        "aliveSessions" TEXT[] DEFAULT '{}'\
    );`;

const CREATE_REPOS_TABLE_QUERY = `\
    CREATE TABLE repos(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "name" ${REPO_NAME_TYPE} NOT NULL,\
        "ownerId" BIGINT REFERENCES "users"("id") ON DELETE CASCADE,\
        "description" ${REPO_DESCRIPTION_TYPE} DEFAULT 'No description provided.',\
        "likes" INT DEFAULT 0,\
        "isPrivate" BOOLEAN DEFAULT FALSE\
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
