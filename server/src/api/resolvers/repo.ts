import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { User } from "../entities/User";

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error: string | null = null;

    @Field(() => Repo, { nullable: true })
    repo: Repo | null = null;
};

const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

@Resolver()
export class RepoResolver
{
    @Mutation(() => RepoResponse)
    async createRepo(
        @Ctx() { pgCon, req }: ApolloContext,
        @Arg("name") name: string,
        @Arg("public") _public: boolean
    )
    {
        let response = new RepoResponse();

        if(req.session.userId === undefined)
        {
            response.error = "You are not logged in";
            return response;
        }

        if(!name.match(REPO_NAME_REGEX))
        {
            response.error = "Repo name contains invalid characters";
            return response;
        }

        const user = await pgCon.manager.findOne(User, { id: req.session.userId });
        if(user === undefined)
        {
            response.error = "Internal server error";
            return response;
        }

        const repo = new Repo();
        if(!repo.build(user!.username, name, _public))
        {
            response.error = "Repo already exists";
            return response;
        }

        user!.repos.push(name);
        pgCon.manager.save(user);

        response.repo = await pgCon.manager.save(repo);
        return response;
    }

    @Mutation(() => Boolean)
    async deleteRepo(
        @Ctx() { pgCon, req }: ApolloContext,
        @Arg("name") name: string,
        @Arg("public") _public: boolean
    ): Promise<Boolean>
    {
        return true;
    }
};
