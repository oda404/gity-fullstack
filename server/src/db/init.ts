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

    `CREATE OR REPLACE FUNCTION\
        add_user(\
            _username ${USERNAME_TYPE},\
            _email ${EMAIL_TYPE},\
            _hash TEXT\
        )\
        RETURNS SETOF users\
    AS $$\
        INSERT INTO users("username", "email", "hash") VALUES(\
            _username, _email, _hash\
        ) RETURNING *;\
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION\
        delete_user(\
            _id BIGINT\
        )\
        RETURNS INT\
    AS $$\
        WITH c as (
            DELETE FROM users WHERE "id" = _id RETURNING *\
        ) SELECT COUNT (*) FROM c;
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION\
        update_user(\
            _id BIGINT,\
            _username ${USERNAME_TYPE},\
            _email ${EMAIL_TYPE},\
            _isEmailVerified BOOLEAN,\
            _hash TEXT,\
            _aliveSessions TEXT[]\
        )\
        RETURNS SETOF users\
    AS $$\
        UPDATE users SET\
            "username" = _username,\
            "email" = _email,\
            "isEmailVerified" = _isEmailVerified,\
            "hash" = _hash,\
            "aliveSessions" = _aliveSessions,\
            "editedAt" = CURRENT_TIMESTAMP\
        WHERE "id" = _id RETURNING *;\
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION
        logout_user(
            _id BIGINT,
            _sessId TEXT
        )
        RETURNS SETOF users
    AS $$
        UPDATE users SET "editedAt" = CURRENT_TIMESTAMP, "aliveSessions" = (SELECT * FROM array_remove("aliveSessions", _sessId)) WHERE "id" = _id RETURNING *;
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION\
        add_repo(\
            _name ${REPO_NAME_TYPE},\
            _ownerId BIGINT,\
            _isPrivate BOOLEAN\
        )\
        RETURNS SETOF repos\
    AS $$\
        INSERT INTO repos("name", "ownerId", "isPrivate") VALUES(\
            _name, _ownerId, _isPrivate\
        ) RETURNING *;\
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION
        find_repo(
            _name ${REPO_NAME_TYPE},
            _owner ${USERNAME_TYPE}
        )
        RETURNS SETOF repos
    AS $$
        SELECT r.* FROM repos r
        WHERE r."name" = _name AND r."ownerId" = (SELECT "id" FROM users WHERE "username" = _owner);
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION\
        delete_repo(\
            _name ${REPO_NAME_TYPE},
            _ownerId BIGINT
        )\
        RETURNS INT\
    AS $$
        WITH c as (
            DELETE FROM repos WHERE "name" = _name AND "ownerId" = _ownerId RETURNING *\
        ) SELECT COUNT (*) FROM c;
    $$ LANGUAGE 'sql';`,

    `CREATE OR REPLACE FUNCTION \
        find_repos(\
            _ownerId BIGINT,\
            _count INT,\
            _start INT\
        )\
        RETURNS SETOF repos\
    AS $$
        SELECT * FROM repos WHERE "ownerId" = _ownerId OFFSET _start LIMIT _count;
    $$ LANGUAGE 'sql';`
];

const PREPARES = [
    
];

export function initDB(client: Client): void
{
    FUNCTIONS.forEach( func => {
        client.query(func);
    });
}
