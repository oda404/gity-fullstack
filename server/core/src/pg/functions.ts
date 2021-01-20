
import { Client } from "pg";
import { getUserConfig } from "gity-core/config-engine";

const userConfig = getUserConfig();

const USERNAME_TYPE = `varchar(${userConfig.usernameMaxLen})`;
const EMAIL_TYPE = `varchar(${userConfig.emailMaxLen})`;

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

export async function runFunctions(client: Client): Promise<void>
{
    for(let i in FUNCTIONS)
    {
        await client.query(FUNCTIONS[i]);
    }
}
