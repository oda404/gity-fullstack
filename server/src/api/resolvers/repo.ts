import { Arg, Authorized, Ctx, Field, Info, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { Container } from "typedi";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { PG_addRepo, PG_deleteRepo, PG_findRepo, PG_findUserRepos } from "../../db/repo";
import { PG_findUser } from "../../db/user";
import { createGitRepoOnDisk, deleteGitRepoFromDisk } from "../../gitService/utils";
import { join } from "path";
import { validateUsername } from "../../utils/userValidation";
import { validateRepoName } from "../../utils/repoValidation";

const START_MIN = 0;
const START_MAX = Number.MAX_SAFE_INTEGER;
const COUNT_MIN = 1;
const COUNT_MAX = 15;

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error?: string;

    @Field(() => [Repo], { defaultValue: [] })
    repos: Repo[] = [];
};

@Resolver(Repo)
export class RepoResolver
{
    private readonly pgClient = Container.get<Client>("pgClient");

    @Authorized(AUTH_COOKIE)
    @Mutation(() => RepoResponse, { nullable: true })
    async createRepo(
        @Ctx() { req }: ApolloContext,
        @Arg("name") name: string,
        @Arg("isPrivate") isPrivate: boolean
    ): Promise<RepoResponse>
    {
        let response = new RepoResponse();

        const valRepoNameRes = validateRepoName(name);
        if(!valRepoNameRes.result)
        {
            response.error = valRepoNameRes.err!;
            return response;
        }

        const repoResponse = (await PG_addRepo(this.pgClient, {
            name,
            ownerId: req.session.userId!,
            isPrivate
        }));

        if(repoResponse.repos?.[0] === undefined || repoResponse.error)
        {
            response.error = "Internal server error.";
            return response;
        }

        if(!createGitRepoOnDisk(join(req.session.userId!.toString(), name)))
        {
            response.error = "Repo already exists";
            return response;
        }
        
        response.repos = repoResponse.repos;
        return response;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async deleteRepo(
        @Ctx() { user }: ApolloContext,
        @Arg("password") password: string,
        @Arg("name") name: string,
    ): Promise<boolean>
    {
        const valRepoNameRes = validateRepoName(name);
        if(!valRepoNameRes.result)
        {
            return false;
        }
        /* delete repo from disk */
        if(!deleteGitRepoFromDisk(join(user!.id.toString(), name)))
        {
            return false;
        }
        /* delete repo db entry */
        if(!(await PG_deleteRepo(this.pgClient, name, user!.id)))
        {
            return false;
        }
        
        return true;
    }

    @Query(() => RepoResponse)
    async getRepo(
        @Ctx() { req }: ApolloContext,
        @Arg("owner") owner: string,
        @Arg("name") name: string
    ): Promise<RepoResponse>
    {
        const response = new RepoResponse();

        if(!validateRepoName(name).result || !validateUsername(owner).result)
        {
            response.error = "Repo not found";
            return response;
        }

        const repoResponse = (await PG_findRepo(this.pgClient, { name, owner }));
        if(repoResponse.repos?.[0] === undefined || repoResponse.error)
        {
            response.error = "Repo not found";
            return response;
        }

        if(repoResponse.repos![0].isPrivate)
        {
            if(!req.session.userId || req.session.userId !== repoResponse.repos![0].ownerId)
            {
                response.error = "Repo not found";
                return response;
            }
        }

        response.repos = repoResponse.repos!;
        return response;
    }

    @Query(() => RepoResponse)
    async getUserRepos(
        @Ctx() { req }: ApolloContext,
        @Arg("owner") owner: string,
        @Arg("count", () => Int,) count: number,
        @Arg("start", () => Int, { defaultValue: 0 }) start: number
    ): Promise<RepoResponse>
    {
        return PG_findUserRepos(this.pgClient, { owner, count, start }).then( res => {
            /* check for private repos */
            return res;
        } )
    }
};
