"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFunctions = void 0;
const consts_1 = require("./consts");
const FUNCTIONS = [
    `CREATE OR REPLACE FUNCTION\
        find_user(\
            _id BIGINT DEFAULT NULL,\
            _username ${consts_1.USERNAME_TYPE} DEFAULT NULL,\
            _email ${consts_1.EMAIL_TYPE} DEFAULT NULL\
        )\
        RETURNS SETOF users\
    AS $$\
        SELECT * FROM users WHERE\
            (_id IS NULL OR "id" = _id)\
            AND (_username IS NULL OR "username" = _username)\
            AND (_email IS NULL OR "email" = _email);\
    $$ LANGUAGE 'sql';`,
];
async function runFunctions(client) {
    return new Promise(resolve => {
        FUNCTIONS.forEach(async (func) => await client.query(func));
        resolve();
    });
}
exports.runFunctions = runFunctions;
