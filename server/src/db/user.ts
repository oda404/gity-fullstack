import { Client } from "pg";
import { User } from "../api/entities/User";

interface UserDBQueryResponse
{
    user?: User;
    err?: any;
};

interface UserLookupArgs
{
    id?: string | number | null;
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
    { id, username, email, hash, isEmailVerified, repos, aliveSessions }: User
): Promise<UserDBQueryResponse>
{
    return client.query(`SELECT * FROM update_user(\
        '${id}',\
        '${username}',\
        '${email}',\
        '${isEmailVerified}',\
        '${hash}',\
        '{${repos}}',\
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
    return client.query(`SELECT * FROM add_user('${username}', '${email}', '${hash}');`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}

export async function PG_deleteUser(
    client: Client,
    id: string | number
): Promise<boolean>
{
    return client.query(`SELECT * FROM delete_user('${id}');`).then( res => {
        if(res.rows[0] !== undefined)
        {
            return !(res.rows[0].delete_user === 0);
        }

        return false;
    }).catch( () => {
        return false;
    });
}
