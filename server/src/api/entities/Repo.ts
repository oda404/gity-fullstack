import { Field, Int, ObjectType } from "type-graphql";
import { join } from "path";
import { createGitRepoOnDisk } from "../../gitService/utils";

@ObjectType()
export class Repo
{
    id: string | number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    owner: string;

    @Field(() => String)
    createdAt: Date;

    @Field(() => String)
    editedAt: Date;

    @Field(() => String)
    description: string;

    @Field(() => Int)
    likes: number;

    isPrivate: boolean;

    public build(owner: string, name: string, isPrivate: boolean): boolean
    {
        this.owner = owner;
        this.name = name;
        this.isPrivate = isPrivate;
        return createGitRepoOnDisk(join(owner, name));
    }
};
