import { BeforeUpdate, Column, Entity, ObjectID, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";
import { mkdirSync, existsSync, rmdirSync, rmdir, rm } from "fs";
import { spawn } from "child_process";
import { join } from "path";
import { rootGitDir } from "../../service/gityServer";

function createRepoOnDisk(repoPath: string): boolean
{
    const joinedPath = join(rootGitDir, repoPath);
    if(existsSync(joinedPath))
    {
        return false;
    }

    mkdirSync(joinedPath)
    spawn("git", [ "init", "--bare", joinedPath ]);
    return true;
}

// bacuse @BeforeRemove() doesn t work
function deleteRepoFromDisk(repoPath: string): boolean
{
    const joinedPath = join(rootGitDir, repoPath);
    if(existsSync(joinedPath))
    {
        rm(joinedPath, { recursive: true, force: true },  () => {});
        return true;
    }
    else
    {
        return false;
    }
}

@ObjectType()
@Entity("repos")
export class Repo
{
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

    @Column()
    public: boolean;

    public build(owner: string, name: string, _public: boolean): boolean
    {
        this.owner = owner;
        this.name = name;
        this.public = _public;
        return createRepoOnDisk(join(owner, name));
    }

    @BeforeUpdate()
    public beforeUpdateHook()
    {
        this.modifiedAt =  new Date();
    }
};
