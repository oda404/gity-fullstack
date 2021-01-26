'use strict'

const git = require("./lib/config/git");
const pg = require("./lib/config/pg");
const redis = require("./lib/config/redis");
const user = require("./lib/config/user");
const repo = require("./lib/config/repo");
const web = require("./lib/config/web");
const gitService = require("./lib/config/git-service");
const privateAPI = require("./lib/config/private-api");

const validateConfigs = () => {
    pg.validatePGConfig();
    redis.validateRedisConfig();
    git.validateGitConfig();
    repo.validateRepoConfig();
    user.validateUserConfig();
    web.validateWebConfig();
    gitService.exitIfInvalidGitServiceConfig();
    privateAPI.exitIfInvalidPrivateAPIConfig();
}

exports.validateConfigs = validateConfigs;
exports.validateRepoConfig = repo.validateRepoConfig;
exports.validateUserConfig = user.validateUserConfig;
exports.validatePGConfig = pg.validatePGConfig;
exports.validateRedisConfig = redis.validateRedisConfig;
exports.validateGitConfig = git.validateGitConfig;
exports.getRepoConfig = repo.getRepoConfig;
exports.getUserConfig = user.getUserConfig;
exports.getGitConfig = git.getGitConfig;
exports.getPGConfig = pg.getPGConfig;
exports.getRedisConfig = redis.getRedisConfig;
exports.getWebConfig = web.getWebConfig;
exports.validateWebConfig = web.validateWebConfig;
exports.exitIfInvalidGitServiceConfig = gitService.exitIfInvalidGitServiceConfig;
exports.exitIfInvalidPrivateAPIConfig = privateAPI.exitIfInvalidPrivateAPIConfig;
exports.getGitServiceConfig = gitService.getGitServiceConfig;
exports.getPrivateAPIConfig = privateAPI.getPrivateAPIConfig;
