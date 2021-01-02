import { Arg, Authorized, Ctx, Field, Info, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { Container } from "typedi";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { PG_addRepo, PG_deleteRepo, PG_findRepo, PG_findUserRepos } from "../../db/repo";
import { validateUsername } from "../../utils/userValidation";
import { validateRepoName } from "../../utils/repoValidation";
import { PG_findUser } from "../../db/user";
import { createRepoOnDisk, deleteRepoFromDisk } from "../../utils/repo";

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
            response.error = "Repo already exists";
            return response;
        }

        if(!createRepoOnDisk(req.session.userId!, name))
        {
            response.error = "Internal server error";
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
        if(!deleteRepoFromDisk(user!.id, name))
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

    @Query(() => Repo, { nullable: true })
    async getRepo(
        @Ctx() { req }: ApolloContext,
        @Arg("owner") owner: string,
        @Arg("name") name: string
    ): Promise<Repo | null>
    {
        if(!validateRepoName(name).result || !validateUsername(owner).result)
        {
            return null;
        }

        const repoResponse = (await PG_findRepo(this.pgClient, { name, owner }));
        if(repoResponse.repos?.[0] === undefined || repoResponse.error)
        {
            return null;
        }

        if(repoResponse.repos![0].isPrivate)
        {
            if(!req.session.userId || req.session.userId !== repoResponse.repos![0].ownerId)
            {
                return null;
            }
        }

        return repoResponse.repos[0];
    }

    @Query(() => [Repo], { nullable: true })
    async getUserRepos(
        @Ctx() { req }: ApolloContext,
        @Arg("owner") owner: string,
        @Arg("count", () => Int) count: number,
        @Arg("start", () => Int, { defaultValue: 0 }) start: number
    ): Promise<Repo[] | null>
    {
        if(!validateUsername(owner))
        {
            return null;
        }

        count = Math.min(count, COUNT_MAX);
        count = Math.max(count, COUNT_MIN);
        start = Math.min(start, START_MAX);
        start = Math.max(start, START_MIN);

        const user = (await PG_findUser(this.pgClient, { username: owner })).user
        if(user === undefined)
        {
            return null;
        }

        const repos = (await PG_findUserRepos(this.pgClient, { owner, count, start })).repos;

        /* strip out private repos if user is not logged in or unauthorized */
        if(req.session.userId === undefined || req.session.userId !== user.id)
        {
            for(let i = 0; i < repos.length; ++i)
            {
                if(repos[i].isPrivate)
                {
                    repos.splice(i--, 1);
                }
            }
        }

        return repos;
    }
};
