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
    name = sanitizeSingleQuotes(name)!;

    return client.query(`EXECUTE addRepoPlan(\
        '${name}',\
        '${ownerId}',\
        '${isPrivate}'\
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
    name = sanitizeSingleQuotes(name)!;
    owner = sanitizeSingleQuotes(owner)!;

    return client.query(`EXECUTE findRepoPlan('${name}', '${owner}');`).then( res => {
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
    name = sanitizeSingleQuotes(name)!;
    
    return client.query(`EXECUTE deleteRepoPlan('${name}', '${ownerId}');`).then( res => {
        if(res.rows[0] !== undefined)
        {
            return !(res.rows[0].count === 0);
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
    return client.query(`EXECUTE findUserReposPlan('${owner}', '${count}', '${start}');`).then( res => {
        return {
            repos: res.rows, error: undefined
        };
    }).catch( error => {
        return {
            repos: [], error
        }
    });
}
