import { Redis } from "ioredis";
import { User } from "../api/entities/User";

export async function clearUnusedCookies(user: User, redisClient: Redis)
{
    for(let i = 0; i < user.aliveSessions.length; ++i)
    {
        if(!(await redisClient.exists(`sess:${user.aliveSessions[i]}`)))
        {
            user.aliveSessions.splice(i--, 1);
        }
    }
}