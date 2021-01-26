'use strict'

const readFileSync = require("fs").readFileSync;
const join = require("path").join;
const rootConfigDir = require("../rootConfigDir").rootConfigDir;
const checkForInvalidFields = require("../checkForInvalidFields").checkForInvalidFields;

const filePath = join(rootConfigDir, "entities/repo.json");

const exitIfInvalidRepoConfig = () => {
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
        "nameB64Regex",
        "nameMinLen",
        "nameMaxLen",
        "descriptionB64Regex",
        "descriptionMinLen",
        "descriptionMaxLen"
    ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }
}

const getRepoConfig = () => {
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

exports.exitIfInvalidRepoConfig = exitIfInvalidRepoConfig;
exports.getRepoConfig = getRepoConfig;
