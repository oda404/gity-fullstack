import {
    getGitConfig,
    getPGConfig,
    getRedisConfig,
    getWebConfig,
    getPrivateAPIConfig
} from "gity-core/config-engine";

const pgConfig = getPGConfig();
const redisConfig = getRedisConfig();
const gitConfig = getGitConfig();
const webConfig = getWebConfig();
const privateAPIConfig = getPrivateAPIConfig();

export const PG_DB_MAIN = pgConfig.databases.find(db => db.alias === "main")?.name;
export const PG_HOSTNAME = pgConfig.hostname;
export const PG_PORT = pgConfig.port;
export const PG_USER = pgConfig.users.find(user => user.alias === "private-api")?.name;
export const PG_PASS = process.env.DB_PASS || "pass";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

export const RD_HOSTNAME = redisConfig.hostname;
export const RD_PORT = redisConfig.port;

export const FRONTEND_HOSTNAME = webConfig.hostname;

export const GIT_ROOT_DIR = gitConfig.usersRootDir;
export const __prod__ = false;
export const SERVER_PORT = privateAPIConfig.port;
export const SESSION_COOKIE_NAME = "user-session";
export const AUTH_COOKIE = "AUTH_COOKIE_MW";
export const AUTH_PASSWD = "AUTH_PASSWD_MW";
