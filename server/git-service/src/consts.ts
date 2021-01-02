import { GIT_ROOT_DIR as _GIT_ROOT_DIR } from "../../core/src/git/consts";
import { PG_USER_GIT_SERVICE, PG_HOST as _PG_HOST, PG_PORT as _PG_PORT, PG_DB_MAIN as _PG_DB_MAIN } from "../../core/src/pg/consts";

export const PG_HOST = _PG_HOST;
export const PG_PORT = _PG_PORT;
export const PG_DB_MAIN = _PG_DB_MAIN;
export const PG_USER = PG_USER_GIT_SERVICE;
export const PG_PASS = process.env.DB_PASS || "pass";

export const GIT_ROOT_DIR = _GIT_ROOT_DIR;
export const __prod__ = false;
export const SERVER_PORT = 4201;
