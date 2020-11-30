import * as consts from "../consts";
import * as gitConsts from "../gitService/consts";

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
    console.info(green(`${PREFIX} ${str}`));
}

export function logErr(str: string): void
{
    console.error(red(`ERROR: ${str}`));
}

export function logWarn(str: string): void
{
    console.warn(yellow(`WARNING: ${str}`));
}

export function printServerInfo(): void
{
    console.log("=============================================================");
    if(consts.__prod__)
    {
        logInfo(`Server is running in ${magenta("PRODUCTION")} ${green("mode on")} ${magenta(`PORT ${consts.SERVER_PORT}!`)}`);
        if(consts.DB_PASS === "pass")
        {
            logWarn("DB_PASS was NOT set as an ENV varible!")
        }
        if(consts.SESSION_SECRET === "secret")
        {
            logWarn("SESSION_SECRET was NOT set as an ENV varible!");
        }
    }
    else
    {
        logInfo(`Server is running in ${magenta("DEVELOPMENT")} ${green("mode on")} ${magenta(`PORT ${consts.SERVER_PORT}!`)}`);
    }

    logInfo(`${magenta("GIT_ROOT_DIR")} ${green("is")} ${magenta(`${gitConsts.GIT_ROOT_DIR}`)}`);

    console.log();
}