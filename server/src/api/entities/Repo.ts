import { BeforeUpdate, Column, Entity, ObjectID, PrimaryGeneratedColumn } from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("repos")
export class Repo
{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: ObjectID;

    @Field(() => String)
    @Column()
    name: string;

    @Field(() => String)
    @Column()
    owner: string;

    @Field(() => String)
    @Column("timestamp", { default: new Date() })
    createdAt: Date;

    @Field(() => String)
    @Column("timestamp", { default: new Date() })
    modifiedAt: Date;

    @Field(() => String)
    @Column( { default: "No description provided." } )
    description: string;

    @Field(() => Int)
    @Column( { default: 0 } )
    likes: number;

    @BeforeUpdate()
    public beforeUpdateHook()
    {
        this.modifiedAt =  new Date();
    }
};
