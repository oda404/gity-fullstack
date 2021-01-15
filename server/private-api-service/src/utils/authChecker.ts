import { verify } from "argon2";
import { AuthChecker } from "type-graphql";
import { ApolloContext } from "../types";
import { Container } from "typedi";
import { AUTH_COOKIE, AUTH_PASSWD } from "../consts";
import { PG_findUser } from "../db/user";
import { Client } from "pg";

export const customAuthChecker: AuthChecker<ApolloContext> = async (
    { root, args, context, info },
    roles,
) => {

    switch(roles[0])
    {
    case AUTH_COOKIE:
        return !(context.req.session.userId === undefined)

    case AUTH_PASSWD:
        if(!context.req.session.userId || !args.password)
        {
            return false;
        }

        context.user = await (await PG_findUser(Container.get<Client>("pgClient"), { id: context.req.session.userId })).user;
        if(!context.user)
        {
            return false;
        }
        return (await verify(context.user.hash, args.password));

    default:
        return false;
    }
}
