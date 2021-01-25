import { FetchResult } from "@apollo/client";
import { NextApiRequest as Request, NextApiResponse as Response } from "next";
import { GenerateInvitationDocument, GenerateInvitationMutation } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import { respondBadMethod } from "../../utils/responses";

export default async function handler(req: Request, res: Response) 
{
    if(req.method === "POST")
    {
        const client = createApolloSSRClient();
        try
        {
            const { data: { generateInvitation } }: FetchResult<GenerateInvitationMutation> = 
            await client.mutate({ 
                mutation: GenerateInvitationDocument,
                context: { cookie: req.headers.cookie },
                variables: JSON.parse(req.body)
            });

            if(generateInvitation === null)
            {
                res.statusCode = 401;
            }
            else
            {
                res.statusCode = 200;
            }

            res.end(JSON.stringify(generateInvitation));
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
