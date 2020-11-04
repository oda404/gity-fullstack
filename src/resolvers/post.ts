import { Resolver, Query, Ctx, Arg, ID, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { ApolloContext } from "../types";
import { ObjectId } from "mongodb";

@Resolver()
export class PostResolver
{
    @Query(() => [ Post ])
    async posts(
        @Ctx() { con }: ApolloContext
    ): Promise<Post[]>
    {
        return con.manager.find(Post);
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg("id", () => ID) id: string | number,
        @Ctx() { con }: ApolloContext
    ): Promise<Post | undefined>
    {
        return con.manager.findOne(Post, { _id: new ObjectId(id) } );
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id", () => ID) id: string | number,
        @Ctx() { con }: ApolloContext
    ): Promise<boolean>
    {
        const post = await con.manager.findOne(Post, { _id: new ObjectId(id) });
        if(post !== undefined)
        {
            con.manager.delete(Post, { _id: new ObjectId(id) });
            return true;
        }

        return false;
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("op",      () => String) op:      string,
        @Arg("title",   () => String) title:   string,
        @Arg("content", () => String) content: string,
        @Ctx() { con }: ApolloContext
    ): Promise<Post>
    {
        return con.manager.save(new Post(op, title, content));
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id",      () => ID)                         id:      string | number,
        @Arg("title",   () => String, { nullable: true }) title:   string | null,
        @Arg("content", () => String, { nullable: true }) content: string | null,
        @Ctx() { con }: ApolloContext
    ): Promise<Post | undefined>
    {
        const post = await con.manager.findOne(Post, { _id: new ObjectId(id)  });
        
        if(post === undefined)
        {
            return undefined;
        }

        post.title = (title === null) ? post.title : title;
        post.content = (content === null) ? post.content : content;

        return con.manager.save(post);
    }
};
