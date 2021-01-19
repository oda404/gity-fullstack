import { hash } from "argon2";
import { getUserConfig } from "gity-core/config-engine";

const userConfig = getUserConfig();
const TIME_COST = userConfig.passwdHashTimeCost;
const SALT_LEN = userConfig.passwdHashSaltLen;

export async function hashPassword(passwd: string): Promise<string>
{
    return await hash(passwd, { saltLength: SALT_LEN, timeCost: TIME_COST });
}
