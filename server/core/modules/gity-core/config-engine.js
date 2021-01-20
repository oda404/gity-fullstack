'use strict'

const git = require("./lib/config/git");
const pg = require("./lib/config/pg");
const redis = require("./lib/config/redis");
const user = require("./lib/config/user");
const repo = require("./lib/config/repo");

const validateConfigs = () => {
    pg.validatePGConfig();
    redis.validateRedisConfig();
    git.validateGitConfig();
    repo.validateRepoConfig();
    user.validateUserConfig();
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
