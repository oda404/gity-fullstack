import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import { SelfDocument, SelfQuery, LoginUserMutation } from '../generated/graphql';

function typesafeUpdateQuery<Result, Query>(
    cache: Cache,
    queryInput: QueryInput,
    result: any,
    fn: (res: Result, query: Query) => any
)
{
    return cache.updateQuery(queryInput, data => fn(result, data as any) as any);
}

const ccache = cacheExchange({
    updates: {
        Mutation: {
            loginUser: (result, _, cache, __) => {
                typesafeUpdateQuery<LoginUserMutation, SelfQuery>(
                    cache, 
                    { query: SelfDocument }, 
                    result, 
                    (res, query) => {
                        console.log("ass");
                        if(res.loginUser.errors)
                        {
                            return query;
                        }
                        else
                        {
                            return {
                                self: res.loginUser.user
                            }
                        }
                    }
                );
            }
        }
    }
});

export default ccache;
