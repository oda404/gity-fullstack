import { FetchResult } from "@apollo/client";
import { NextApiRequest as Request, NextApiResponse as Response } from "next";
import { LoginUserDocument, LoginUserMutation, } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import { respondBadMethod } from "../../utils/responses";

export default async function handler(req: Request, res: Response)
{
    if(req.method === "POST")
    {
        const client = createApolloSSRClient();
        try
        {
            const { data: { loginUser }, context }: FetchResult<LoginUserMutation> = 
            await client.mutate({ 
                mutation: LoginUserDocument,
                variables: { userInput: JSON.parse(req.body) },
            });

            if(loginUser.error === null)
            {
                res.statusCode = 200;
                res.setHeader("set-cookie", context.headers.get("set-cookie"));
            }
            else
            {
                res.statusCode = 401;
            }

            res.end(JSON.stringify(loginUser));

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
