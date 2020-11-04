import { ObjectIdColumn, Column, Entity, ObjectID, BeforeInsert } from "typeorm";
import { ObjectType, Field, Int, ID } from "type-graphql";

@ObjectType()
@Entity("posts")
export class Post
{
    @Field(() => ID)
    @ObjectIdColumn()
    _id: ObjectID;

    @Field(() => String)
    @Column()
    op: string;

    @Field(() => String)
    @Column({ nullable: false })
    createdAt: Date;

    @Field(() => String)
    @Column()
    title: string;

    @Field(() => String)
    @Column()
    content: string;

    @Field(() => Int)
    @Column({ default: 0 })
    likes: number;

    @Field(() => Int)
    @Column({ default: 0 })
    dislikes: number;

    constructor(_op: string, _title: string, _content: string)
    {
        this.op = _op;
        this.title = _title;
        this.content = _content;
        this.likes = 0;
        this.dislikes = 0;
    }

    @BeforeInsert()
    public beforeInsertHook()
    {
        this.createdAt = new Date();
    }
};
