import { Field, ID, ObjectType } from "type-graphql";
import { Entity, ObjectID, Column, PrimaryGeneratedColumn } from "typeorm";
import { hash } from "argon2";

@ObjectType()
@Entity("users")
export class User
{
    @PrimaryGeneratedColumn()
    id: ObjectID;
    
    @Field(() => String)
    @Column("timestamp", { default: new Date() })
    createdAt: Date;

    @Field(() => String)
    @Column("timestamp", { default: new Date() })
    editedAt: Date;

    @Field(() => String)
    @Column({ unique: true })
    username: string;

    @Field(() => String)
    @Column({ unique: true })
    email: string;

    @Field(() => Boolean)
    @Column({ default: false })
    isEmailVerified: boolean;

    @Column()
    hash: string;

    @Field(() => [ String ])
    @Column("text", { array: true, default: "{}" })
    repos: string[];

    public async build(_username: string, _email: string, _password: string)
    {
        this.username = _username;
        this.email = _email;
        return hash(_password, { timeCost: 32, saltLength: 64 }).then(hash => {
            this.hash = hash;
        });
    }
};
