import { verify } from "argon2";
import { AuthChecker } from "type-graphql";
import { User } from "../api/entities/User";
import { ApolloContext } from "../types";

export const customAuthChecker: AuthChecker<ApolloContext> = async (
    { root, args, context, info },
    roles,
) => {

    switch(roles[0])
    {
    case "basic":
        if(context.req.session.userId === undefined)
        {
            return false;
        }
        break;

    case "extended":
        if(context.req.session.userId === undefined || args.password === undefined)
        {
            return false;
        }

        const user = await context.con.manager.findOne(User, { id: context.req.session.userId });
        if(user === undefined)
        {
            return false;
        }
        const hashResult = await verify(user.hash, args.password);
        if(!hashResult)
        {
            return false;
        }
        break;
    }

    return true;
}
