import { v4 as genuuidv4} from "uuid";
import { Redis } from "ioredis";
import { Container } from "typedi";

export async function genInvitation(userId: number): Promise<string>
{
    const redis = Container.get<Redis>("redisClient");
    let uuid = genuuidv4();
    while((await getInvitation(uuid)) !== null)
    {
        uuid = genuuidv4();
    }

    redis.set(`inv:${uuid}`, userId, "EX",  60 * 60 * 24);

    return uuid;
}

export async function deleteInvitation(uuid: string): Promise<boolean>
{
    const redis = Container.get<Redis>("redisClient");
    return (await redis.del(`inv:${uuid}`)) > 0;
}

/* The number return value is the user id associated with the invitation */
export async function getInvitation(uuid: string): Promise<number | null>
{
    const redis = Container.get<Redis>("redisClient");
    const result = await redis.get(`inv:${uuid}`);
    return result as number | null;
}
