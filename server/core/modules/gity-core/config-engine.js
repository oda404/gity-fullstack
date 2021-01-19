'use strict'

const readFileSync = require("fs").readFileSync;
const join = require("path").join;

const isFieldValid = (field) => {
    const sField = field?.toString();
    return !(sField === undefined || sField.match(/^ *$/) || sField === "");
}

const checkForInvalidFields = (fields, json, filePath) => {
    for(let i in fields)
    {
        if(!isFieldValid(json[fields[i]]))
        {
            console.log(`In file '${filePath}', field '${fields[i]}' is empty or missing.`);
            return false;
        }
    }

    return true;
}

const rootConfigDir = "/etc/gity";

const validatePGConfiguration = () => {
    const filePath = join(rootConfigDir, "pg.json");
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
        "host",
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
    const filePath = join(rootConfigDir, "pg.json");
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

const validateRedisConfiguration = () => {
    const filePath = join(rootConfigDir, "redis.json");
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
        "host",
        "port"
    ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }
}

const getRedisConfig = () => {
    const filePath = join(rootConfigDir, "redis.json");
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

const validateGitConfiguration = () => {
    const filePath = join(rootConfigDir, "git.json");
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
        "usersRootDir"
    ];

    if(!checkForInvalidFields(required_fields, json, filePath))
    {
        process.exit(1);
    }
}

const getGitConfig = () => {
    const filePath = join(rootConfigDir, "git.json");
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

const validateUserConfiguration = () => {
    const filePath = join(rootConfigDir, "entities/user.json");
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
    const filePath = join(rootConfigDir, "entities/user.json");
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

const validateRepoConfiguration = () => {
    const filePath = join(rootConfigDir, "entities/repo.json");
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
    const filePath = join(rootConfigDir, "entities/repo.json");
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

const validateConfigurations = () => {
    validatePGConfiguration();
    validateRedisConfiguration();
    validateGitConfiguration();
    validateUserConfiguration();
    validateRepoConfiguration();
}

exports.validateConfigurations = validateConfigurations;
exports.validateRepoConfiguration = validateRepoConfiguration;
exports.validateUserConfiguration = validateUserConfiguration;
exports.validatePGConfiguration = validatePGConfiguration;
exports.validateRedisConfiguration = validateRedisConfiguration;
exports.validateGitConfiguration = validateGitConfiguration;
exports.getRepoConfig = getRepoConfig;
exports.getUserConfig = getUserConfig;
exports.getGitConfig = getGitConfig;
exports.getPGConfig = getPGConfig;
exports.getRedisConfig = getRedisConfig;
