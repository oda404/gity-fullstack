'use strict'

const readFileSync = require("fs").readFileSync;
const join = require("path").join;
const rootConfigDir = require("../rootConfigDir").rootConfigDir;
const checkForInvalidFields = require("../checkForInvalidFields").checkForInvalidFields;

const filePath = join(rootConfigDir, "entities/user.json");

const exitIfInvalidUserConfig = () => {
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
        "usernameB64Regex",
        "usernameMinLen",
        "usernameMaxLen",
        "passwdB64Regex",
        "passwdMinLen",
        "passwdMaxLen",
        "emailB64Regex",
        "emailMaxLen"
    ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }
}

const getUserConfig = () => {
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

exports.exitIfInvalidUserConfig = exitIfInvalidUserConfig;
exports.getUserConfig = getUserConfig;
