import { Client } from "pg";
import { sanitizeSingleQuotes } from "../utils/sanitizeSingleQuotes";
import { User } from "./entities/user";

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
