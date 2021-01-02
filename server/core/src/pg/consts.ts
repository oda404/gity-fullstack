import { REPO_NAME_MAX_LENGTH, REPO_DESCRIPTION_MAX_LENGTH } from "../entities/repo/consts";
import { USERNAME_MAX_LENGTH, EMAIL_MAX_LENGTH } from "../entities/user/consts";

export const PG_HOST = "192.168.0.200";
export const PG_PORT = 5432;
export const PG_DB_MAIN = "gity_main";
export const PG_USER_PRIVATE_API = "gity_private_api";
export const PG_USER_GIT_SERVICE = "gity_git_service";
export const USERNAME_TYPE = `VARCHAR(${USERNAME_MAX_LENGTH})`;
export const EMAIL_TYPE = `VARCHAR(${EMAIL_MAX_LENGTH})`;
export const REPO_NAME_TYPE = `VARCHAR(${REPO_NAME_MAX_LENGTH})`;
export const REPO_DESCRIPTION_TYPE = `VARCHAR(${REPO_DESCRIPTION_MAX_LENGTH})`;
