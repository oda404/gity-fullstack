import { FetchResult } from "@apollo/client";
import { NextApiRequest as Request, NextApiResponse as Response } from "next";
import { CreateUserDocument, CreateUserMutation } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import { respondBadMethod } from "../../utils/responses";

export default async function handler(req: Request, res: Response)
{
    if(req.method === "POST")
    {
        const client = createApolloSSRClient();

        try
        {
            const { data: { createUser } }: FetchResult<CreateUserMutation> = 
            await client.mutate({ 
                mutation: CreateUserDocument,
                variables: { userInput: JSON.parse(req.body) },
            });

            res.statusCode = createUser.user === null ? 400 : 200;

            res.end(JSON.stringify(createUser));

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
