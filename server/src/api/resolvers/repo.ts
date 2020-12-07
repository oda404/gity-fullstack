import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { Container } from "typedi";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";
import { Client } from "pg";
import { REPO_NAME_MAX_LENGTH } from "../../db/conts";
import { PG_findUser, PG_updateUser } from "../../db/user";
import { PG_addRepo, PG_deleteRepo, PG_findRepo } from "../../db/repo";
import { createGitRepoOnDisk, deleteGitRepoFromDisk } from "../../gitService/utils";
import { join } from "path";

@ObjectType()
class RepoResponse
{
    @Field(() => String, { nullable: true })
    error?: string;

    @Field(() => Repo, { nullable: true })
    repo?: Repo;
};

const REPO_NAME_REGEX = /^[a-zA-Z0-9\-_]*$/;

@Resolver()
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

        const user = await (await PG_findUser(this.pgClient, { id: req.session.userId })).user
        if(user === undefined)
        {
            response.error = "User not found";
            return response;
        }

        if(!createGitRepoOnDisk(join(user!.username, name)))
        {
            response.error = "Repo already exists";
            return response;
        }

        response.repo = (await PG_addRepo(this.pgClient, {
            name,
            ownerId: user.id,
            isPrivate
        })).repo;

        if(response.repo === undefined)
        {
            response.error = "Internal server error.";
            return response;
        }

        user.reposId.push(response.repo.id.toString());
        PG_updateUser(this.pgClient, user);

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
        const repo = (await PG_findRepo(this.pgClient, { name, ownerId: user!.id })).repo;
        if(repo === undefined)
        {
            return false;
        }

        /* update user's repos */
        const index = user!.reposId.indexOf(repo.id.toString());
        if(index > -1)
        {
            user!.reposId.splice(index, 1);
            PG_updateUser(this.pgClient, user!);
        }
        /* delete repo from disk */
        if(!deleteGitRepoFromDisk(join(user!.username, repo.name)))
        {
            return false;
        }
        /* delete repo db entry */
        if(!(await PG_deleteRepo(this.pgClient, repo.id)))
        {
            return false;
        }
        
        return true;
    }
};
