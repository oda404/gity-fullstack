import { FetchResult } from "@apollo/client";
import { 
    NextApiRequest as Request, 
    NextApiResponse as Response 
} from "next";
import { LogoutUserDocument, LogoutUserMutation } from "../../generated/graphql";
import createApolloSSRClient from "../../utils/apollo-gsspClient.ts";
import { respondBadMethod } from "../../utils/responses";

export default async function handler(req: Request, res: Response)
{
    if(req.method === "POST")
    {
        const client = createApolloSSRClient();

        try
        {
            const { data: { logoutUser }, context }: FetchResult<LogoutUserMutation> =
            await client.mutate({ 
                mutation: LogoutUserDocument,
                context: { cookie: req.headers.cookie }
            });

            res.statusCode = logoutUser === null ? 401 : 200;
            res.setHeader("set-cookie", context.headers.get("set-cookie"));

            res.end(JSON.stringify(logoutUser));
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
