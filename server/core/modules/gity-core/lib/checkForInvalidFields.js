'use strict'

const isFieldValid = require("./isFieldValid").isFieldValid;

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

exports.checkForInvalidFields = checkForInvalidFields;
