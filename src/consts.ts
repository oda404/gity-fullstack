import process from "process";

export const __prod__ = false;
export const __port__ = 4200;
export const __pass_hash_it__ = 10000;
export const __pass_salt_len__ = 256;
export const __pass_hash_len__ = 64;
export const __pass_hash_alg__ = "sha512";
export const __email_regex__ = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const __username_regex__ = /^[a-zA-Z0-9\-_]*$/;
export const __db_pass__ = process.env.DB_PASS;
