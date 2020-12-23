import { Field, ObjectType } from "type-graphql";
import { Repo } from "./Repo";

@ObjectType()
export class User
{
    @Field(() => String)
    id: number;
    
    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    editedAt: Date;

    @Field(() => String)
    username: string;

    email: string;

    @Field(() => Boolean)
    isEmailVerified: boolean;

    hash: string;

    @Field(() => [ Repo ], { defaultValue: [] })
    repos: Repo[] = [];

    aliveSessions: string[];
};
