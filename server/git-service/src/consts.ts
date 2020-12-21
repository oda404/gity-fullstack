import { GIT_ROOT_DIR as _GIT_ROOT_DIR } from "../../core/src/git/consts";

export const DB_USER = process.env.DB_USER || "gity";
export const DB_PASS = process.env.DB_PASS || "pass";

export const GIT_ROOT_DIR = _GIT_ROOT_DIR;
export const __prod__ = false;
export const SERVER_PORT = 4201;
