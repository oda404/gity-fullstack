"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarn = exports.logErr = exports.logInfo = exports.magenta = exports.yellow = exports.green = exports.red = exports.initLogging = void 0;
let _prefix = '>';
let _service;
function initLogging(service, prefix) {
    _service = service;
    if (prefix !== undefined) {
        _prefix = prefix;
    }
}
exports.initLogging = initLogging;
function red(str) {
    return `\x1b[31m${str}\x1b[0m`;
}
exports.red = red;
function green(str) {
    return `\x1b[32m${str}\x1b[0m`;
}
exports.green = green;
function yellow(str) {
    return `\x1b[33m${str}\x1b[0m`;
}
exports.yellow = yellow;
function magenta(str) {
    return `\x1b[35m${str}\x1b[0m`;
}
exports.magenta = magenta;
function logInfo(str) {
    console.info(`${_service}${green(`${_prefix} ${str}`)}`);
}
exports.logInfo = logInfo;
function logErr(str) {
    console.error(`${_service}${red(`ERROR: ${str}`)}`);
}
exports.logErr = logErr;
function logWarn(str) {
    console.warn(`${_service}${yellow(`WARNING: ${str}`)}`);
}
exports.logWarn = logWarn;
