"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPO_DESCRIPTION_TYPE = exports.REPO_NAME_TYPE = exports.EMAIL_TYPE = exports.USERNAME_TYPE = void 0;
const consts_1 = require("../entities/repo/consts");
const consts_2 = require("../entities/user/consts");
exports.USERNAME_TYPE = `VARCHAR(${consts_2.USERNAME_MAX_LENGTH})`;
exports.EMAIL_TYPE = `VARCHAR(${consts_2.EMAIL_MAX_LENGTH})`;
exports.REPO_NAME_TYPE = `VARCHAR(${consts_1.REPO_NAME_MAX_LENGTH})`;
exports.REPO_DESCRIPTION_TYPE = `VARCHAR(${consts_1.REPO_DESCRIPTION_MAX_LENGTH})`;
