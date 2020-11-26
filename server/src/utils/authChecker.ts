import { verify } from "argon2";
import { AuthChecker } from "type-graphql";
import { User } from "../api/entities/User";
import { ApolloContext } from "../types";
import { Container } from "typedi";
import { Connection } from "typeorm";
import { AUTH_COOKIE, AUTH_PASSWD } from "../consts";

export const customAuthChecker: AuthChecker<ApolloContext> = async (
    { root, args, context, info },
    roles,
) => {

    switch(roles[0])
    {
    case AUTH_COOKIE:
        return !(context.req.session.userId === undefined)

    case AUTH_PASSWD:
        if(context.req.session.userId === undefined || args.password === undefined)
        {
            return false;
        }

        context.user = await Container.get<Connection>("pgCon").manager.findOne(User, { id: context.req.session.userId });
        if(context.user === undefined)
        {
            return false;
        }
        const hashResult = await verify(context.user.hash, args.password);
        return hashResult

    default:
        return false;
    }
}
