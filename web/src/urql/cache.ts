import { cacheExchange, QueryInput, Cache } from '@urql/exchange-graphcache';
import { SelfDocument, SelfQuery, LoginUserMutation, LogoutUserMutation } from '../generated/graphql';

function typesafeUpdateQuery<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  fn: (res: Result, query: Query) => any
)
{
  return cache.updateQuery(queryInput, data => fn(result, data as any) as any);
}

const customCacheExchange = cacheExchange({
  updates: {
    Mutation: {
      loginUser: (result, _, cache, __) => {
        typesafeUpdateQuery<LoginUserMutation, SelfQuery>(
          cache, 
          { query: SelfDocument }, 
          result, 
          (res, query) => {
            if(res.loginUser.error)
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
      },

      logoutUser: (result, _, cache, __) => {
        typesafeUpdateQuery<LogoutUserMutation, SelfQuery>(
          cache, 
          { query: SelfDocument }, 
          result, 
          (_, __) => {
            return {
              self: null
            }
          }
        );
      },

      createRepo: (_, __, cache, ___) => {
        const allFields = cache.inspectFields("Query");
        const fieldInfos = allFields.filter((info) => info.fieldName === "getUserRepos");
        fieldInfos.forEach((fi) => {
          cache.invalidate("Query", "getUserRepos", fi.arguments || {});
        });
      }
    }
  }
});

export default customCacheExchange;
