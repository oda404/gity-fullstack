import * as consts from "../consts";

const PREFIX = '>';

function red(str: string): string
{
    return `\x1b[31m${str}\x1b[0m`;
}

function green(str: string): string
{
    return `\x1b[32m${str}\x1b[0m`;
}

function yellow(str: string): string
{
    return `\x1b[33m${str}\x1b[0m`;
}

function magenta(str: string): string
{
    return `\x1b[35m${str}\x1b[0m`;
}

export function logInfo(str: string): void
{
    console.info(green(`[PRIVATE_API] ${PREFIX} ${str}`));
}

export function logErr(str: string): void
{
    console.error(red(`[PRIVATE_API] ERROR: ${str}`));
}

export function logWarn(str: string): void
{
    console.warn(yellow(`[PRIVATE_API] WARNING: ${str}`));
}

export function printServerInfo(): void
{
    if(consts.__prod__)
    {
        logInfo(`Server is running in ${magenta("PRODUCTION")} ${green("mode on")} ${magenta(`PORT ${consts.SERVER_PORT}!`)}`);
    }
    else
    {
        logInfo(`Server is running in ${magenta("DEVELOPMENT")} ${green("mode on")} ${magenta(`PORT ${consts.SERVER_PORT}!`)}`);
    }

    console.log();
}