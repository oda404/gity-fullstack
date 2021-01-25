import { FetchResult } from "@apollo/client";
import { NextApiRequest as Request, NextApiResponse as Response } from "next";
import { CreateRepositoryDocument, CreateRepositoryMutation } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import { respondBadMethod } from "../../utils/responses";

export default async function handler(req: Request, res: Response)
{
    if(req.method ===  "POST")
    {
        const client = createApolloSSRClient();
        try
        {
            const { data: { createRepository } }: FetchResult<CreateRepositoryMutation> = 
            await client.mutate({ 
                mutation: CreateRepositoryDocument,
                context: { cookie: req.headers.cookie },
                variables: JSON.parse(req.body)
            });

            res.statusCode = createRepository.error === null ? 200 : 401;
            res.end(JSON.stringify(createRepository));
        } catch(_) {
            res.statusCode = 500;
            res.end();
        }
    }
    else
    {
        respondBadMethod(res);
    }
}
