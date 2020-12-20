export const __prod__ = Boolean(process.env.PROD) || false;
export const SERVER_PORT = 4200;
export const DB_PASS = process.env.DB_PASS || "pass";
export const SESSION_SECRET = process.env.SESSION_SECRET || "secret";
export const SESSION_COOKIE_NAME = "user-session";
export const AUTH_COOKIE = "COOKIE";
export const AUTH_PASSWD = "PASSWD";
