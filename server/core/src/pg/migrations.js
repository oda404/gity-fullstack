"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const consts_1 = require("./consts");
const TABLES = [
    `CREATE TABLE users(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "username" ${consts_1.USERNAME_TYPE} UNIQUE NOT NULL,\
        "email" ${consts_1.EMAIL_TYPE} UNIQUE NOT NULL,\
        "isEmailVerified" BOOLEAN DEFAULT FALSE,\
        "hash" TEXT NOT NULL,\
        "aliveSessions" TEXT[] DEFAULT '{}'\
    );`,
    `CREATE TABLE repos(\
        "id" BIGINT GENERATED ALWAYS AS IDENTITY,\
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "editedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\
        "name" ${consts_1.REPO_NAME_TYPE} NOT NULL,\
        "ownerId" BIGINT REFERENCES "users"("id") ON DELETE CASCADE,\
        "description" ${consts_1.REPO_DESCRIPTION_TYPE} DEFAULT 'No description provided.',\
        "likes" INT DEFAULT 0,\
        "isPrivate" BOOLEAN DEFAULT FALSE\
    );`
];
const CONSTRAINTS = [
    "ALTER TABLE repos ADD CONSTRAINT UNIQUE_ownerId_name UNIQUE(\"name\", \"ownerId\");"
];
async function runMigrations(client) {
    return new Promise(resolve => {
        TABLES.forEach(async (table) => await client.query(table));
        CONSTRAINTS.forEach(async (constraint) => await client.query(constraint));
        resolve();
    });
}
exports.runMigrations = runMigrations;
