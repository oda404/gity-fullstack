import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { spawn } from "child_process";
import { rootGitDir } from "../../service/gityServer";
import { join } from "path";
import { ApolloContext } from "../../types";
import { mkdir } from "fs/promises";
import { User } from "../entities/User";

@InputType()
class RepoAddInput
{
    @Field()
    name: string;
};

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error: string | null;

    @Field(() => Repo, { nullable: true })
    repo: Repo | null;
};

function createRepoOnDisk(repoPath: string): Promise<boolean>
{
    return mkdir(join(rootGitDir, repoPath)).then(() => {
        spawn("git", [ "init", "--bare", join(rootGitDir, repoPath) ]);
        return true;
    }).catch(() => {
        return false;
    });
}

const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

@Resolver()
export class RepoResolver
{
    @Mutation(() => RepoResponse)
    async createRepo(
        @Ctx() { con, req }: ApolloContext,
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

        const user = await con.manager.findOne(User, { id: req.session.userId });
        if(!user)
        {
            response.error = "User not found. Please contact Gity admins";
            return response;
        }

        return createRepoOnDisk(`${user.username}/${repoInput.name}`).then(async (created) => {
            if(!created)
            {
                response.error = "Repo already exists";
                return response;
            }

            const repo = new Repo();
            repo.owner = user.username;
            repo.name = repoInput.name;

            user.repos.push(repoInput.name);
            con.manager.save(User, user);

            response.repo = await con.manager.save(repo);

            return response;
        });
    }

    @Mutation(() => Boolean)
    async deleteRepo(
        @Ctx() { con, req }: ApolloContext,
        @Arg("repoInput") repoInput: RepoAddInput
    ): Promise<Boolean>
    {
        

        return true;
    }
};
