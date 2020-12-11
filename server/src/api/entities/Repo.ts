import { Field, Int, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Repo
{
    id: string | number;

    @Field(() => String)
    name: string;

    ownerId: string;

    @Field(() => User)
    owner: User;

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
