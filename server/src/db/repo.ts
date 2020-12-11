import { Client } from "pg";
import { Repo } from "../api/entities/Repo";

interface RepoAddArgs
{
    name: string;
    ownerId: number | string;
    isPrivate: boolean;
};

interface RepoLookupArgs
{
    name: string;
    owner: string;
};

interface ReposLookupArgs
{
    ownerId: string | number;
    count: number;
    start: number
};

interface RepoDBQueryResponse
{
    repo?: Repo;
    err?: any;
}

export function PG_addRepo(
    client: Client, 
    { name, ownerId, isPrivate }: RepoAddArgs
): Promise<RepoDBQueryResponse>
{
    return client.query(`SELECT * FROM add_repo(\
        '${name}',\
        '${ownerId}',\
        ${isPrivate}\
    );`).then( res => {
        return { repo: res.rows[0], err: undefined };
    }).catch( err => {
        return { repo: undefined, err };
    });
}

export async function PG_findRepo(
    client: Client,
    { name, owner }: RepoLookupArgs
): Promise<RepoDBQueryResponse>
{
    return client.query(`SELECT * FROM find_repo('${name}', '${owner}');`).then( res => {
        return { repo: res.rows[0], err: undefined };
    }).catch( err => {
        return { repo: undefined, err };
    })
}

export async function PG_deleteRepo(
    client: Client,
    name: string,
    ownerId: string | number
): Promise<boolean>
{
    return client.query(`SELECT * FROM delete_repo('${name}', '${ownerId}');`).then( res => {
        if(res.rows[0] !== undefined)
        {
            return !(res.rows[0].delete_user === 0);
        }

        return false;
    }).catch( () => {
        return false;
    });
}

export async function PG_findRepos(
    client: Client,
    { ownerId, count, start }: ReposLookupArgs
): Promise<Repo[]>
{
    return client.query(`SELECT * FROM find_repos('${ownerId}', '${count}', '${start}');`).then( res => {
        return res.rows;
    }).catch( () => {
        return [];
    });
}
