import { IncomingMessage } from "http";

export default function parseCookiesFromIncomingMessage(req: IncomingMessage)
{
    const cookies = new Map<string, string>();

    req.headers.cookie?.split(',').forEach(cok => {
        const sep = cok.indexOf('=');
        cookies.set(cok.substring(0, sep), cok.substring(sep + 1));
    });

    return cookies;
}