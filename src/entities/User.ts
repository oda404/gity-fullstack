import { Field, ID, ObjectType } from "type-graphql";
import { Entity, ObjectID, Column, PrimaryGeneratedColumn } from "typeorm";
import crypto from "crypto";
import { __pass_hash_it__, __pass_hash_alg__, __pass_hash_len__, __pass_salt_len__ } from "../consts";

export function getHashedPassword(password: string, salt: string): string
{
    return crypto.pbkdf2Sync(
        String(password), /* because just _password doesn't work ??? */
        salt, 
        __pass_hash_it__, 
        __pass_hash_len__, 
        __pass_hash_alg__
    ).toString("hex");
}

@ObjectType()
@Entity("users")
export class User
{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: ObjectID;
    
    @Field(() => String)
    @Column("timestamp", { default: new Date() })
    createdAt: Date;

    @Field(() => String)
    @Column()
    username: string;

    @Field(() => String)
    @Column()
    email: string;

    @Field(() => Boolean)
    @Column({ default: false })
    isEmailVerified: boolean;

    @Column()
    hash: string;

    @Column()
    salt: string;

    @Field(() => [ String ])
    @Column("text", { array: true, default: "{}" })
    joinedReds: string[];

    constructor(_username: string, _email: string, _password: string)
    {
        this.username = _username;
        this.email = _email;
        this.salt = crypto.randomBytes(__pass_salt_len__).toString("base64");
        this.hash = getHashedPassword(_password, this.salt);
    }
};
