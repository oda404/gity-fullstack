import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Repo
{
    id: string | number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    owner: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    editedAt: Date;

    @Field(() => String)
    description: string;

    @Field(() => Int)
    likes: number;

    isPrivate: boolean;
};
