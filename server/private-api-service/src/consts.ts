import { GIT_ROOT_DIR as _GIT_ROOT_DIR } from "../../core/src/git/consts";

export const DB_USER = process.env.DB_USER || "gity";
export const DB_PASS = process.env.DB_PASS || "pass";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

export const GIT_ROOT_DIR = _GIT_ROOT_DIR;
export const __prod__ = false;
export const SERVER_PORT = 4200;
export const SESSION_COOKIE_NAME = "user-session";
export const AUTH_COOKIE = "COOKIE";
export const AUTH_PASSWD = "PASSWD";
