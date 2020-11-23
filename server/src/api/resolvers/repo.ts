import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { User } from "../entities/User";

@InputType()
class RepoAddInput
{
    @Field()
    name: string;

    @Field()
    public: boolean;
};

@InputType()
class RepoDeleteInput
{
    @Field()
    name: string;

    @Field()
    password: string;
};

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error: string | null = null;

    @Field(() => Repo, { nullable: true })
    repo: Repo | null = null;
};

@ObjectType()
class RepoDeleteResponse
{
    @Field(() => String, { nullable: true })
    error: string | null = null;

    @Field(() => Boolean, { nullable: true })
    deleted: boolean | null = null;
};

const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

@Resolver()
export class RepoResolver
{
    @Mutation(() => RepoResponse)
    async createRepo(
        @Ctx() { pgCon, req }: ApolloContext,
        @Arg("repoInput") repoInput: RepoAddInput
    )
    {
        let response = new RepoResponse();

        if(req.session.userId === undefined)
        {
            response.error = "You are not logged in";
            return response;
        }

        if(!repoInput.name.match(REPO_NAME_REGEX))
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
        if(!repo.build(user!.username, repoInput.name, repoInput.public))
        {
            response.error = "Repo already exists";
            return response;
        }

        user!.repos.push(repoInput.name);
        pgCon.manager.save(user);

        response.repo = await pgCon.manager.save(repo);
        return response;
    }

    @Mutation(() => RepoDeleteResponse)
    async deleteRepo(
        @Ctx() { pgCon, req }: ApolloContext,
        @Arg("repoInput") repoInput: RepoDeleteInput
    ): Promise<RepoDeleteResponse>
    {
        const response = new RepoDeleteResponse();

        return response;
    }
};
