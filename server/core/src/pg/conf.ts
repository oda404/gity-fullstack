
import { readFileSync } from "fs";

interface PGDatabase
{
    alias: string;
    name: string;
}

interface PGUser
{
    alias: string;
    name: string;
}

export  function validateRedisConfig(): boolean
{
    return true;
}

export function getPGHost(): string | undefined
{
    return JSON.parse(readFileSync("/etc/gity/pg.json").toString())["host"];
}

export  function getPGPort(): number | undefined
{
    return JSON.parse(readFileSync("/etc/gity/pg.json").toString())["port"];
}

export  function getPGDatabases(): PGDatabase[] | undefined
{
    return JSON.parse(readFileSync("/etc/gity/pg.json").toString())["databases"];
}

export  function getPGUsers(): PGUser[] | undefined
{
    return JSON.parse(readFileSync("/etc/gity/pg.json").toString())["users"];
}
