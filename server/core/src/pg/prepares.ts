
import { Client } from "pg";
import { USERNAME_TYPE, EMAIL_TYPE, REPO_NAME_TYPE } from "./consts";

const PREPARES = [
    `PREPARE addUserPlan(${USERNAME_TYPE}, ${EMAIL_TYPE}, TEXT) AS
        INSERT INTO users("username", "email", "hash")
        VALUES($1, $2, $3) RETURNING *;
    `,
    `PREPARE deleteUserPlan(BIGINT) AS
        WITH c AS (
            DELETE FROM users WHERE
            "id" = $1
            RETURNING *
        ) SELECT COUNT (*) FROM c;
    `,
    `PREPARE updateUserPlan(BIGINT, ${USERNAME_TYPE}, ${EMAIL_TYPE}, BOOLEAN, TEXT, TEXT[]) AS
        UPDATE users SET
            "username" = $2,
            "email" = $3,
            "isEmailVerified" = $4,
            "hash" = $5,
            "aliveSessions" = $6,
            "editedAt" = CURRENT_TIMESTAMP
        WHERE "id" = $1 RETURNING *;
    `,
    `PREPARE logoutUserPlan(BIGINT, TEXT) AS
        UPDATE users SET
            "editedAt" = CURRENT_TIMESTAMP,
            "aliveSessions" = (SELECT * FROM array_remove("aliveSessions", $2))
        WHERE "id" = $1 RETURNING *;
    `,
    `PREPARE addRepoPlan(${REPO_NAME_TYPE}, BIGINT, BOOLEAN) AS
        INSERT INTO repos("name", "ownerId", "isPrivate")
        VALUES($1, $2, $3) RETURNING *;
    `,
    `PREPARE findRepoPlan(${REPO_NAME_TYPE}, ${USERNAME_TYPE}) AS
        SELECT * FROM repos WHERE
        "name"    = $1 AND
        "ownerId" = (SELECT "id" FROM users WHERE "username" = $2);
    `,
    `PREPARE deleteRepoPlan(${REPO_NAME_TYPE}, BIGINT) AS
        WITH c AS (
            DELETE FROM repos WHERE
            "name" = $1 AND 
            "ownerId" = $2
            RETURNING *
        ) SELECT COUNT (*) FROM c;
    `,
    `PREPARE findUserReposPlan(${USERNAME_TYPE}, INT, INT) AS
        SELECT r.*
        FROM repos r
        WHERE 
        "ownerId" = (SELECT "id" FROM users WHERE "username" = $1)
        OFFSET $3
        LIMIT $2;
    `
];

export async function runPreparedStatements(client: Client): Promise<void>
{
    return new Promise<void>( resolve => {

        PREPARES.forEach(async prep => await client.query(prep));

        resolve();
    });
}
