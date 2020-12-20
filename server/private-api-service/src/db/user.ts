import { Client } from "pg";
import { User } from "../api/entities/User";
import { sanitizeSingleQuotes } from "../utils/sanitizeSingleQuotes";

interface UserDBQueryResponse
{
    user?: User;
    err?: any;
};

interface UserLookupArgs
{
    id?: number;
    username?: string;
    email?: string;
};

interface UserAddArgs
{
    username: string;
    email: string;
    hash: string;
};

export async function PG_updateUser(
    client: Client,
    { id, username, email, hash, isEmailVerified, aliveSessions }: User
): Promise<UserDBQueryResponse>
{
    username = sanitizeSingleQuotes(username)!;
    email = sanitizeSingleQuotes(email)!;

    return client.query(`EXECUTE updateUserPlan(\
        '${id}',\
        '${username}',\
        '${email}',\
        '${isEmailVerified}',\
        '${hash}',\
        '{${aliveSessions}}'\
    );`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}

export async function PG_findUser(
    client: Client,
    { id, username, email }: UserLookupArgs
): Promise<UserDBQueryResponse>
{
    if(id === undefined && username === undefined && email === undefined)
    {
        return { user: undefined, err: "No args specified" };
    }

    username = sanitizeSingleQuotes(username);
    email = sanitizeSingleQuotes(email);

    return client.query(`SELECT * FROM find_user(\
        "_id"       => ${ id       === undefined ? `NULL` : `'${id}'` },\
        "_username" => ${ username === undefined ? `NULL` : `'${username}'` },\
        "_email"    => ${ email    === undefined ? `NULL` : `'${email}'` }\
    );`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}

export async function PG_addUser(
    client: Client,
    { username, email, hash }: UserAddArgs
): Promise<UserDBQueryResponse>
{
    username = sanitizeSingleQuotes(username)!;
    email = sanitizeSingleQuotes(email)!;

    return client.query(`EXECUTE addUserPlan('${username}', '${email}', '${hash}');`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}

export async function PG_deleteUser(
    client: Client,
    id: number
): Promise<boolean>
{

    return client.query(`EXECUTE deleteUserPlan('${id}');`).then( res => {
        if(res.rows[0] !== undefined)
        {
            return !(res.rows[0].count === 0);
        }

        return false;
    }).catch( () => {
        return false;
    });
}

export async function PG_logoutUser(
    client: Client,
    id: number,
    sessId: string
): Promise<UserDBQueryResponse>
{
    sessId = sanitizeSingleQuotes(sessId)!;

    return client.query(`EXECUTE logoutUserPlan('${id}', '${sessId}');`).then(res => {
        return {
            user: res.rows[0]
        }
    }).catch(err => {
        return {
            err
        }
    })
}
