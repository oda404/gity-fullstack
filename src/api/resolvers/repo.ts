import { Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { spawn } from "child_process";
import { rootGitDir } from "../../service/gityServer";
import { join } from "path";

@InputType()
class RepoAddInput
{
    @Field()
    name: string;

    @Field()
    owner: string;
};

@ObjectType()
class RepoResponse
{
    @Field(() => [ String ], { nullable: true })
    errors: string[] | null;

    @Field(() => Repo)
    repo: Repo | null;
};

function createRepoOnDisk(repoPath: string)
{
    spawn("git", [ "init", "--bare", join(rootGitDir, repoPath) ]);
}

@Resolver()
export class RepoResolver
{
    @Mutation(() => RepoResponse)
    async addRepo(): Promise<RepoResponse>
    {
        let response = new RepoResponse();

        
        
        return response;
    }

    @Mutation(() => Boolean)
    async deleteRepo(): Promise<Boolean>
    {
        

        return true;
    }
};
