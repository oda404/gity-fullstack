
const PREFIX = '>'

export function logInfo(str: string): void
{
    console.info(`${PREFIX} ${str}`);
}

export function logErr(str: string): void
{
    console.error(`${PREFIX} ${str}`);
}
