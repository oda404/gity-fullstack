import { Client } from "pg";
import { sanitizeSingleQuotes } from "../utils/sanitizeSingleQuotes";
import { Repo } from "./entities/repo";

interface RepoLookupArgs
{
    name: string;
    owner: string;
};

interface RepoDBQueryResponse
{
    repo?: Repo;
    error?: any;
}

export async function PG_findRepo(
    client: Client,
    { name, owner }: RepoLookupArgs
): Promise<RepoDBQueryResponse>
{
    const nameC = sanitizeSingleQuotes(name);
    const ownerC = sanitizeSingleQuotes(owner);

    return client.query(`EXECUTE findRepoPlan('${nameC}', '${ownerC}');`).then( res => {
        return { repo: res.rows[0], error: undefined };
    }).catch( error => {
        return { repo: undefined, error };
    })
}
