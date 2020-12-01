import { Field, Int, ObjectType } from "type-graphql";

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
};
