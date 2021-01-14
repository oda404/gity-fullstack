import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { APIHost } from "./apiHost";

export default function createApolloSSRClient(cookies: Map<string, string>): ApolloClient<NormalizedCacheObject>
{
    let parsedCookies: string = "";
    cookies.forEach( (value, key) => {
        parsedCookies += `${key}=${value};`;
    });

    return new ApolloClient({
        ssrMode: true,
        link: createHttpLink({
            uri: APIHost,
            credentials: "include",
            headers: { cookie: parsedCookies },
        }),
        cache: new InMemoryCache()
    });
}
