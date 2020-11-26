import { Arg, Authorized, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { Repo } from "../entities/Repo";
import { ApolloContext } from "../../types";
import { User } from "../entities/User";
import { Container } from "typedi";
import { Connection } from "typeorm";
import { AUTH_COOKIE, AUTH_PASSWD } from "../../consts";

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
    private readonly pgCon = Container.get<Connection>("pgCon");

    @Authorized(AUTH_COOKIE)
    @Mutation(() => RepoResponse, { nullable: true })
    async createRepo(
        @Ctx() { req }: ApolloContext,
        @Arg("name") name: string,
        @Arg("public") _public: boolean
    ): Promise<RepoResponse | null>
    {
        let response = new RepoResponse();

        if(!name.match(REPO_NAME_REGEX))
        {
            response.error = "Repo name contains invalid characters";
            return response;
        }

        const user = await this.pgCon.manager.findOne(User, { id: req.session.userId });
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
        this.pgCon.manager.save(user);

        response.repo = await this.pgCon.manager.save(repo);
        return response;
    }

    @Authorized(AUTH_PASSWD)
    @Mutation(() => Boolean, { nullable: true })
    async deleteRepo(
        @Ctx() { req, user }: ApolloContext,
        @Arg("name") name: string,
        @Arg("public") _public: boolean
    ): Promise<boolean>
    {


        return true;
    }
};
