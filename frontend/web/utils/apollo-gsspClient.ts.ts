import { 
    ApolloClient, 
    ApolloLink, 
    createHttpLink, 
    from, 
    InMemoryCache, 
    NextLink, 
    NormalizedCacheObject, 
    Operation
} from "@apollo/client";
import { APIHost } from "./apiHost";

export default function createApolloSSRClient(): ApolloClient<NormalizedCacheObject>
{
    const beforeLink = new ApolloLink((op: Operation, forward: NextLink) => {
        op.setContext({
            headers: {
                cookie: op.getContext().cookie
            }
        });
        return forward(op);
    })

    const afterLink = new ApolloLink((op: Operation, forward: NextLink) => {
        return forward(op).map(response => {
            const context = op.getContext();
            response.context = { headers: new Map<string, string>(context.response.headers) }
            return response
        });
    })

    return new ApolloClient({
        ssrMode: true,
        link: from([beforeLink, afterLink, createHttpLink({
            uri: APIHost,
            credentials: "include",
        })]),
        cache: new InMemoryCache()
    });
}
