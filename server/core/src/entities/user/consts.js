"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_REGEX = exports.PASSWORD_MAX_LENGTH = exports.PASSWORD_MIN_LENGTH = exports.FORBIDDEN_USERNAMES = exports.USERNAME_MAX_LENGTH = exports.USERNAME_MIN_LENGTH = exports.USERNAME_REGEX = exports.EMAIL_MAX_LENGTH = exports.EMAIL_REGEX = void 0;
exports.EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.EMAIL_MAX_LENGTH = 80;
exports.USERNAME_REGEX = /^[a-zA-Z0-9\-_]*$/;
exports.USERNAME_MIN_LENGTH = 3;
exports.USERNAME_MAX_LENGTH = 35;
exports.FORBIDDEN_USERNAMES = [
    "login",
    "regiser",
    "new",
    "tos",
];
exports.PASSWORD_MIN_LENGTH = 8;
exports.PASSWORD_MAX_LENGTH = 80;
exports.PASSWORD_REGEX = /^.*(?=.{8,80})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+[{\]\};:'",<.>/?\\|`~]).*$/;
