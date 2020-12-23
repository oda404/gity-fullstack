import { hash } from "argon2";

export async function hashPassword(pass: string): Promise<string>
{
    return await hash(pass, { timeCost: 32, saltLength: 64 });
}
