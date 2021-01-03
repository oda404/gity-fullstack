import { REPO_NAME_MAX_LENGTH, REPO_DESCRIPTION_MAX_LENGTH } from "../entities/repo/consts";
import { USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH } from "../entities/user/consts";
import { getPGDatabases, getPGHost, getPGPort, getPGUsers } from "./conf";

export const PG_DB_MAIN = getPGDatabases()?.find(db => db.alias === "main")?.name!;
export const PG_HOST = getPGHost()!;
export const PG_PORT = getPGPort()!;
export const PG_USER_GIT_SERVICE = getPGUsers()?.find(user => user.alias === "git-service")?.name!;
export const PG_USER_PRIVATE_API = getPGUsers()?.find(user => user.alias === "private-api")?.name!;
export const USERNAME_TYPE = `VARCHAR(${USERNAME_MAX_LENGTH})`;
export const EMAIL_TYPE = `VARCHAR(${EMAIL_MAX_LENGTH})`;
export const REPO_NAME_TYPE = `VARCHAR(${REPO_NAME_MAX_LENGTH})`;
export const REPO_DESCRIPTION_TYPE = `VARCHAR(${REPO_DESCRIPTION_MAX_LENGTH})`;
