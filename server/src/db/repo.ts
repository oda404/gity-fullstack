import { Client } from "pg";
import { Repo } from "../api/entities/Repo";

interface RepoAddArgs
{
    name: string;
    owner: string;
    isPrivate: boolean;
};

interface RepoLookupArgs
{
    id?: string | number;
    name?: string;
    owner?: string;
};

interface RepoDBQueryResponse
{
    repo?: Repo;
    err?: any;
}

export function PG_addRepo(
    client: Client, 
    { name, owner, isPrivate }: RepoAddArgs
): Promise<RepoDBQueryResponse>
{
    return client.query(`SELECT * FROM add_repo(\
        '${name}',\
        '${owner}',\
        ${isPrivate}\
    );`).then( res => {
        return { repo: res.rows[0], err: undefined };
    }).catch( err => {
        return { repo: undefined, err };
    });
}

export async function PG_findRepo(
    client: Client,
    { id, name, owner }: RepoLookupArgs
): Promise<RepoDBQueryResponse>
{
    if(id === undefined && name === undefined && owner === undefined)
    {
        return { repo: undefined, err: "No args specified" }
    }

    return client.query(`SELECT * FROM find_repo(\
        "_id" => ${ id === undefined ? `NULL` : `'${id}'` },\
        "_name" => ${ name === undefined ? `NULL` : `'${name}'` },\
        "_owner" => ${ owner === undefined ? `NULL` : `'${owner}'` }\
    );`).then( res => {
        return { repo: res.rows[0], err: undefined };
    }).catch( err => {
        return { repo: undefined, err };
    })
}

export async function PG_deleteRepo(
    client: Client,
    id: number | string
): Promise<boolean>
{
    return client.query(`SELECT * FROM delete_repo('${id}');`).then( res => {
        if(res.rows[0] !== undefined)
        {
            return !(res.rows[0].delete_user === 0);
        }

        return false;
    }).catch( () => {
        return false;
    });
}
