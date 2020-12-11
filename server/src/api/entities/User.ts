import { Field, ObjectType } from "type-graphql";
import { hash } from "argon2";
import { Repo } from "./Repo";

export async function hashPassword(password: string): Promise<string>
{
    return hash(password, { timeCost: 32, saltLength: 64 }).then(hash => {
        return hash;
    });
}

@ObjectType()
export class User
{
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
