import { Arg, Authorized, Ctx, Field, Info, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { Container } from "typedi";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { REPO_NAME_MAX_LENGTH } from "../../db/conts";
import { PG_findUser, PG_updateUser } from "../../db/user";
import { PG_addRepo, PG_deleteRepo, PG_findRepo, PG_findRepos } from "../../db/repo";
import { createGitRepoOnDisk, deleteGitRepoFromDisk } from "../../gitService/utils";
import { join } from "path";
import { USERNAME_REGEX } from "../../utils/userValidation";
import { info } from "console";

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error?: string;

    @Field(() => [Repo], { defaultValue: [] })
    repos: Repo[] = [];
};

const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

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

        if(!name.match(REPO_NAME_REGEX))
        {
            response.error = "Repo name contains invalid characters";
            return response;
        }

        if(name.length > REPO_NAME_MAX_LENGTH)
        {
            response.error = `Repo name can't be longer than ${REPO_NAME_MAX_LENGTH}`;
            return response;
        }

        const repoResponse = (await PG_addRepo(this.pgClient, {
            name,
            ownerId: req.session.userId!,
            isPrivate
        }));

        if(repoResponse.repo === undefined || repoResponse.err)
        {
            response.error = "Internal server error.";
            return response;
        }

        if(!createGitRepoOnDisk(join(req.session.userId!, name)))
        {
            response.error = "Repo already exists";
            return response;
        }
        
        response.repos.push(repoResponse.repo);
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
        if(!name.match(REPO_NAME_REGEX))
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

        if(!name.match(REPO_NAME_REGEX) || !owner.match(USERNAME_REGEX))
        {
            response.error = "Repo not found";
            return response;
        }

        const repoResponse = (await PG_findRepo(this.pgClient, { name, owner }));
        if(repoResponse.repo === undefined || repoResponse.err)
        {
            response.error = "Repo not found";
            return response;
        }

        if(repoResponse.repo.isPrivate)
        {
            if(!req.session.userId || req.session.userId !== repoResponse.repo.ownerId)
            {
                response.error = "Repo not found";
                return response;
            }
        }

        response.repos.push(repoResponse.repo);
        return response;
    }

    @Query(() => RepoResponse)
    async getRepos(
        @Ctx() { req }: ApolloContext,
        @Arg("owner") owner: string,
        @Arg("count", () => Int) count: number,
        @Arg("start", () => Int, { defaultValue: 0 }) start: number
    )
    {
        // const response = new RepoResponse();
        
        // const user = (await PG_findUser(this.pgClient, { username: owner })).user;
        // if(user === undefined)
        // {
        //     response.error = "User not found";
        //     return response;
        // }

        // response.repos = (await PG_findRepos(this.pgClient, { ownerId: user.id, count, start }));

        // /* strip out private repos if user is not logged in */
        // if(req.session.userId === undefined || req.session.userId !== user.id)
        // {
        //     let i = response.repos.length;
        //     while(i--)
        //     {
        //         if(response.repos[i].isPrivate)
        //         {
        //             response.repos.splice(i, 1);
        //         }
        //     }
        // }

        // return response;
    }
};
