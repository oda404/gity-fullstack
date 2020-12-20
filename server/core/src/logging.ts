
let _prefix = '>';
let _service: string;

export function initLogging(service: string, prefix?: string): void
{
    _service = service;
    if(prefix !== undefined)
    {
        _prefix = prefix;
    }
}

export function red(str: string): string
{
    return `\x1b[31m${str}\x1b[0m`;
}

export function green(str: string): string
{
    return `\x1b[32m${str}\x1b[0m`;
}

export function yellow(str: string): string
{
    return `\x1b[33m${str}\x1b[0m`;
}

export function magenta(str: string): string
{
    return `\x1b[35m${str}\x1b[0m`;
}

export function logInfo(str: string): void
{
    console.info(`${_service}${green(`${_prefix} ${str}`)}`);
}

export function logErr(str: string): void
{
    console.error(`${_service}${red(`ERROR: ${str}`)}`);
}

export function logWarn(str: string): void
{
    console.warn(`${_service}${yellow(`WARNING: ${str}`)}`);
}
