import { ServerResponse as Response } from "http";

export function respondBadMethod(res: Response)
{
    res.statusCode = 405;
    res.end();
}

export function redirectTo(location: string, res: Response)
{
    res.writeHead(302, {
        Location: location
    });
    res.end();
}
