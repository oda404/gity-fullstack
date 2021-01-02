import { GIT_ROOT_DIR as _GIT_ROOT_DIR } from "../../core/src/git/consts";
import { PG_USER_PRIVATE_API, PG_HOST as _PG_HOST, PG_PORT as _PG_PORT, PG_DB_MAIN as _PG_DB_MAIN } from "../../core/src/pg/consts";
import { RD_HOST as _RD_HOST, RD_PORT as _RD_PORT } from "../../core/src/redis/consts";

export const PG_DB_MAIN = _PG_DB_MAIN;
export const PG_HOST = _PG_HOST;
export const PG_PORT = _PG_PORT;
export const PG_USER = PG_USER_PRIVATE_API;
export const PG_PASS = process.env.DB_PASS || "pass";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

export const RD_HOST = _RD_HOST;
export const RD_PORT = _RD_PORT;

export const GIT_ROOT_DIR = _GIT_ROOT_DIR;
export const __prod__ = false;
export const SERVER_PORT = 4200;
export const SESSION_COOKIE_NAME = "user-session";
export const AUTH_COOKIE = "COOKIE";
export const AUTH_PASSWD = "PASSWD";
