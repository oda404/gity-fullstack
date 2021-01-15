import { getRedisHost, getRedisPort } from "../../core/src/redis/conf";
import { getPGHost, getPGPort, getPGUsers, getPGDatabases } from "../../core/src/pg/conf";
import { getGitReposRootDir } from "../../core/src/git/conf";

export const PG_DB_MAIN = getPGDatabases()?.find(db => db.alias === "main")?.name!;
export const PG_HOST = getPGHost()!;
export const PG_PORT = getPGPort()!;
export const PG_USER = getPGUsers()?.find(user => user.alias === "private-api")?.name!;
export const PG_PASS = process.env.DB_PASS || "pass";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

export const RD_HOST = getRedisHost()!;
export const RD_PORT = getRedisPort()!;

export const GIT_ROOT_DIR = getGitReposRootDir()!;
export const __prod__ = false;
export const SERVER_PORT = 4200;
export const SESSION_COOKIE_NAME = "user-session";
export const AUTH_COOKIE = "AUTH_COOKIE_MW";
export const AUTH_PASSWD = "AUTH_PASSWD_MW";
