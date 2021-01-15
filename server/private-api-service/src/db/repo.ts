import { Client } from "pg";
import { Repo } from "../api/entities/Repo";
import { sanitizeSingleQuotes } from "../utils/sanitizeSingleQuotes";

interface RepoAddArgs
{
    name: string;
    ownerId: number;
    isPrivate: boolean;
};

interface RepoLookupArgs
{
    name: string;
    owner: string;
};

interface UserReposLookupArgs
{
    owner: string;
    count: number;
    start: number;
};

interface RepoDBQueryResponse
{
    repos: Repo[];
    error?: any;
}

export function PG_addRepo(
    client: Client, 
    { name, ownerId, isPrivate }: RepoAddArgs
): Promise<RepoDBQueryResponse>
{
    const nameC = sanitizeSingleQuotes(name);

    return client.query(`EXECUTE addRepoPlan(
        '${nameC}',
        '${ownerId}',
        '${isPrivate}'
    );`).then( res => {
        return { repos: res.rows, error: undefined };
    }).catch( error => {
        return { repos: [], error };
    });
}

export async function PG_findRepo(
    client: Client,
    { name, owner }: RepoLookupArgs
): Promise<RepoDBQueryResponse>
{
    const nameC = sanitizeSingleQuotes(name);
    const ownerC = sanitizeSingleQuotes(owner);

    return client.query(`EXECUTE findRepoPlan('${nameC}', '${ownerC}');`).then( res => {
        return { repos: res.rows, error: undefined };
    }).catch( error => {
        return { repos: [], error };
    })
}

export async function PG_deleteRepo(
    client: Client,
    name: string,
    ownerId: number
): Promise<boolean>
{
    const nameC = sanitizeSingleQuotes(name);
    
    return client.query(`EXECUTE deleteRepoPlan('${nameC}', '${ownerId}');`).then( res => {
        if(res.rows[0])
        {
            return !(parseInt(res.rows[0].count) === 0);
        }

        return false;
    }).catch( () => {
        return false;
    });
}

export async function PG_findUserRepos(
    client: Client,
    { owner, count, start }: UserReposLookupArgs
): Promise<RepoDBQueryResponse>
{
    const ownerC = sanitizeSingleQuotes(owner);
    
    return client.query(`EXECUTE findUserReposPlan('${ownerC}', '${count}', '${start}');`).then( res => {
        return {
            repos: res.rows, error: undefined
        };
    }).catch( error => {
        return {
            repos: [], error
        }
    });
}
