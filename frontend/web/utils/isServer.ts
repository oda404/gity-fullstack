
export function isServer(): Boolean
{
    return typeof window === undefined;
}
