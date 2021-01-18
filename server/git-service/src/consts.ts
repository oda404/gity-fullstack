
import {
    getGitConfig,
    getPGConfig,
} from "gity/config-engine";

let pgConfig = getPGConfig();
let gitConfig = getGitConfig();

export const PG_HOST = pgConfig.host;
export const PG_PORT = pgConfig.port;
export const PG_DB_MAIN = pgConfig.databases.find(db => db.alias === "main")?.name;
export const PG_USER = pgConfig.users.find(user => user.alias === "git-service")?.name;
export const PG_PASS = process.env.DB_PASS || "pass";

export const GIT_ROOT_DIR = gitConfig.usersRootDir;
export const __prod__ = false;
export const SERVER_PORT = 4201;
