import { Client } from "pg";
import { EMAIL_TYPE, REPO_NAME_TYPE, USERNAME_TYPE } from "./consts";

const FUNCTIONS = [
    `CREATE OR REPLACE FUNCTION\
        find_user(\
            _id BIGINT DEFAULT NULL,\
            _username ${USERNAME_TYPE} DEFAULT NULL,\
            _email ${EMAIL_TYPE} DEFAULT NULL\
        )\
        RETURNS SETOF users\
    AS $$\
        SELECT * FROM users WHERE\
            (_id IS NULL OR "id" = _id)\
            AND (_username IS NULL OR "username" = _username)\
            AND (_email IS NULL OR "email" = _email);\
    $$ LANGUAGE 'sql';`,
];

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
        SELECT * FROM repos WHERE
        "ownerId" = (SELECT "id" FROM users WHERE "username" = $1)
        OFFSET $3
        LIMIT $2;
    `
];

export function initDB(client: Client): void
{
    FUNCTIONS.forEach( func => {
        client.query(func);
    });

    PREPARES.forEach( prep => {
        client.query(prep);
    });
}
