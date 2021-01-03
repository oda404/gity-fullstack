import { getPGHost, getPGPort, getPGUsers, getPGDatabases } from "../../core/src/pg/conf";
import { getGitReposRootDir } from "../../core/src/git/conf";

export const PG_HOST = getPGHost()!;
export const PG_PORT = getPGPort()!;
export const PG_DB_MAIN = getPGDatabases()?.find(db => db.alias === "main")?.name!;
export const PG_USER = getPGUsers()?.find(user => user.alias === "git-service")?.name!;
export const PG_PASS = process.env.DB_PASS || "pass";

export const GIT_ROOT_DIR = getGitReposRootDir()!;
export const __prod__ = false;
export const SERVER_PORT = 4201;
