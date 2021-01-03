
import { readFileSync } from "fs";

export  function validateRedisConfig(): boolean
{
    return true;
}

export  function getRedisHost(): string | undefined
{
    return JSON.parse(readFileSync("/etc/gity/redis.json").toString())["host"];
}

export  function getRedisPort(): number | undefined
{
    return JSON.parse(readFileSync("/etc/gity/redis.json").toString())["port"];
}
