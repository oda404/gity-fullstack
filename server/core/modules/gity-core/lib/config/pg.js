'use strict'

const readFileSync = require("fs").readFileSync;
const join = require("path").join;
const rootConfigDir = require("../rootConfigDir").rootConfigDir;
const checkForInvalidFields = require("../checkForInvalidFields").checkForInvalidFields;
const isFieldValid = require("../isFieldValid").isFieldValid;

const filePath = join(rootConfigDir, "pg.json");

const exitIfInvalidPGConfig = () => {
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
        "port",
        "databases",
        "users"
    ];
    const required_databases = [ "main" ];
    const required_users = [ "private-api", "git-service" ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }

    for(let reqDBI in required_databases)
    {
        let found = false;
        for(let dbI in json["databases"])
        {
            if(required_databases[reqDBI] === json["databases"][dbI].alias)
            {
                if(!isFieldValid(json["databases"][dbI].name))
                {
                    console.log(`In file '${filePath}', field 'name' for database with alias '${json["databases"][dbI].alias}' is empty or missing.`);
                    process.exit(1);
                }
                found = true;
            }
        }

        if(!found)
        {
            console.log(`In file '${filePath}', no database with alias '${required_databases[reqDBI]}' was found.`);
            process.exit(1);
        }
    }

    for(let reqUserI in required_users)
    {
        let found = false;
        for(let userI in json["users"])
        {
            if(required_users[reqUserI] === json["users"][userI].alias)
            {
                if(!isFieldValid(json["users"][userI].name))
                {
                    console.log(`In file '${filePath}', field 'name' for user with alias '${json["users"][userI].alias}' is empty or missing.`);
                    process.exit(1);
                }
                found = true;
            }
        }

        if(!found)
        {
            console.log(`In file '${filePath}', no user with alias '${required_users[reqUserI]}' was found.`);
            process.exit(1);
        }
    }
}

const getPGConfig = () => {
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

exports.exitIfInvalidPGConfig = exitIfInvalidPGConfig;
exports.getPGConfig = getPGConfig;
