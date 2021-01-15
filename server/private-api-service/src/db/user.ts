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
    masterId: number;
};

export async function PG_updateUser(
    client: Client,
    { id, username, email, hash, isEmailVerified, aliveSessions }: User
): Promise<UserDBQueryResponse>
{
    const usernameC = sanitizeSingleQuotes(username);
    const emailC = sanitizeSingleQuotes(email);

    return client.query(`EXECUTE updateUserPlan(\
        '${id}',\
        '${usernameC}',\
        '${emailC}',\
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
    // fix this fuckery
    if(id === undefined && username === undefined && email === undefined)
    {
        return { user: undefined, err: "No args specified" };
    }

    let usernameC: string;
    let emailC: string;

    if(username !== undefined) usernameC = sanitizeSingleQuotes(username);
    if(email !== undefined) emailC = sanitizeSingleQuotes(email);

    return client.query(`SELECT * FROM find_user(
        "_id"       => ${ id === undefined ? `NULL` : `'${id}'` },
        "_username" => ${ username === undefined ? `NULL` : `'${usernameC!}'` },
        "_email"    => ${ email === undefined ? `NULL` : `'${emailC!}'` }
    );`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}

export async function PG_addUser(
    client: Client,
    { username, email, hash, masterId }: UserAddArgs
): Promise<UserDBQueryResponse>
{
    const usernameC = sanitizeSingleQuotes(username);
    const emailC = sanitizeSingleQuotes(email);

    return client.query(`EXECUTE addUserPlan('${usernameC}', '${emailC}', '${hash}', '${masterId}');`).then( res => {
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
        if(res.rows.length > 0)
        {
            return !(parseInt(res.rows[0].count) === 0);
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
    // maybe redundant ? but fuck it
    const sessIdC = sanitizeSingleQuotes(sessId);

    return client.query(`EXECUTE logoutUserPlan('${id}', '${sessIdC}');`).then(res => {
        return {
            user: res.rows[0]
        }
    }).catch(err => {
        return {
            err
        }
    })
}
