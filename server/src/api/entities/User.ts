import { Field, ObjectType } from "type-graphql";
import { hash } from "argon2";

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
    reposId: string[];

    aliveSessions: string[];

    public async build(_username: string, _email: string, _password: string)
    {
        this.username = _username;
        this.email = _email;
        return hash(_password, { timeCost: 32, saltLength: 64 }).then(hash => {
            this.hash = hash;
        });
    }
};
