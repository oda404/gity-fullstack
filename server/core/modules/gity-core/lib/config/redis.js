'use strict'

const readFileSync = require("fs").readFileSync;
const join = require("path").join;
const rootConfigDir = require("../rootConfigDir").rootConfigDir;
const checkForInvalidFields = require("../checkForInvalidFields").checkForInvalidFields;

const filePath = join(rootConfigDir, "redis.json");

const exitIfInvalidRedisConfig = () => {
    let fileContent;
    try
    {
        fileContent = readFileSync(filePath).toString();
    } catch (_) {
        console.log(`Couldn't open ${filePath}.`);
        process.exit(1);
    }
    const json = JSON.parse(fileContent);

    const required_fields = [
        "hostname",
        "port"
    ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }
}

const getRedisConfig = () => {
    let fileContent;
    try
    {
        fileContent = readFileSync(filePath).toString();
    } catch (_) {
        console.log(`Couldn't open ${filePath}.`);
        return {};
    }
    return JSON.parse(fileContent);
}

exports.exitIfInvalidRedisConfig = exitIfInvalidRedisConfig;
exports.getRedisConfig = getRedisConfig;
