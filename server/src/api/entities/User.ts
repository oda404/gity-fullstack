import { Field, ObjectType } from "type-graphql";
import { hash } from "argon2";

export async function hashPassword(password: string): Promise<string>
{
    return hash(password, { timeCost: 32, saltLength: 64 }).then(hash => {
        return hash;
    });
}

@ObjectType()
export class User
{
    id: string | number;
    
    @Field(() => String)
    createdAt: Date;

    @Field(() => String)
    editedAt: Date;

    @Field(() => String)
    username: string;

    @Field(() => String)
    email: string;

    @Field(() => Boolean)
    isEmailVerified: boolean;

    hash: string;

    @Field(() => [ String ])
    repos: string[];

    aliveSessions: string[];
};
