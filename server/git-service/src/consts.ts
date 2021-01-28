
import {
    getGitConfig,
    getPGConfig,
    getGitServiceConfig
} from "gity-core/config-engine";

const pgConfig = getPGConfig();
const gitConfig = getGitConfig();
const gitServiceConfig = getGitServiceConfig();

export const PG_HOSTNAME  = pgConfig.hostname;
export const PG_PORT      = pgConfig.port;
export const PG_DB_MAIN   = pgConfig.databases.find(db => db.alias === "main")?.name;
export const PG_USER      = pgConfig.users.find(user => user.alias === "git-service")?.name;
export const GIT_ROOT_DIR = gitConfig.usersRootDir;
export const SERVER_PORT  = gitServiceConfig.port;
export const PROD         = process.env.PROD === "true";
export const PG_PASS      = process.env.PG_PASS;
