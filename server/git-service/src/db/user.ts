import { Client } from "pg";
import { sanitizeSingleQuotes } from "../utils/sanitizeSingleQuotes";
import { User } from "./entities/user";

interface UserDBQueryResponse
{
    user?: User;
    err?: any;
};

export async function PG_findUser(
    client: Client,
    username: string
): Promise<UserDBQueryResponse>
{
    const usernameC = sanitizeSingleQuotes(username)!;

    return client.query(`EXECUTE findUserByUsernamePlan('${usernameC}');`).then( res => {
        return { user: res.rows[0], err: undefined };
    }).catch( err => {
        return { user: undefined, err };
    });
}
