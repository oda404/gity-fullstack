"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPreparedStatements = void 0;
var consts_1 = require("./consts");
var PREPARES = [
    "PREPARE addUserPlan(" + consts_1.USERNAME_TYPE + ", " + consts_1.EMAIL_TYPE + ", TEXT) AS\n        INSERT INTO users(\"username\", \"email\", \"hash\")\n        VALUES($1, $2, $3) RETURNING *;\n    ",
    "PREPARE deleteUserPlan(BIGINT) AS\n        WITH c AS (\n            DELETE FROM users WHERE\n            \"id\" = $1\n            RETURNING *\n        ) SELECT COUNT (*) FROM c;\n    ",
    "PREPARE updateUserPlan(BIGINT, " + consts_1.USERNAME_TYPE + ", " + consts_1.EMAIL_TYPE + ", BOOLEAN, TEXT, TEXT[]) AS\n        UPDATE users SET\n            \"username\" = $2,\n            \"email\" = $3,\n            \"isEmailVerified\" = $4,\n            \"hash\" = $5,\n            \"aliveSessions\" = $6,\n            \"editedAt\" = CURRENT_TIMESTAMP\n        WHERE \"id\" = $1 RETURNING *;\n    ",
    "PREPARE logoutUserPlan(BIGINT, TEXT) AS\n        UPDATE users SET\n            \"editedAt\" = CURRENT_TIMESTAMP,\n            \"aliveSessions\" = (SELECT * FROM array_remove(\"aliveSessions\", $2))\n        WHERE \"id\" = $1 RETURNING *;\n    ",
    "PREPARE addRepoPlan(" + consts_1.REPO_NAME_TYPE + ", BIGINT, BOOLEAN) AS\n        INSERT INTO repos(\"name\", \"ownerId\", \"isPrivate\")\n        VALUES($1, $2, $3) RETURNING *;\n    ",
    "PREPARE findRepoPlan(" + consts_1.REPO_NAME_TYPE + ", " + consts_1.USERNAME_TYPE + ") AS\n        SELECT * FROM repos WHERE\n        \"name\"    = $1 AND\n        \"ownerId\" = (SELECT \"id\" FROM users WHERE \"username\" = $2);\n    ",
    "PREPARE deleteRepoPlan(" + consts_1.REPO_NAME_TYPE + ", BIGINT) AS\n        WITH c AS (\n            DELETE FROM repos WHERE\n            \"name\" = $1 AND \n            \"ownerId\" = $2\n            RETURNING *\n        ) SELECT COUNT (*) FROM c;\n    ",
    "PREPARE findUserReposPlan(" + consts_1.USERNAME_TYPE + ", INT, INT) AS\n        SELECT r.*\n        FROM repos r\n        WHERE \n        \"ownerId\" = (SELECT \"id\" FROM users WHERE \"username\" = $1)\n        OFFSET $3\n        LIMIT $2;\n    "
];
function runPreparedStatements(client) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    PREPARES.forEach(function (prep) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, client.query(prep)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    resolve();
                })];
        });
    });
}
exports.runPreparedStatements = runPreparedStatements;
