import { ObjectType } from "type-graphql";
import { BeforeInsert, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@ObjectType()
@Entity("users")
export class User
{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({ nullable: false })
    createdAt: Date;

    @Column()
    userName: string;

    @Column()
    email: string;

    @Column()
    hash: string;

    @Column()
    salt: number;

    @Column()
    joinedReds: string[];

    constructor(_userName: string, _email: string, _password: string)
    {
        this.userName = _userName;
        this.email = _email;

        //hash and salt
    }

    @BeforeInsert()
    public beforeInsertHook()
    {
        this.createdAt = new Date();
    }
};
