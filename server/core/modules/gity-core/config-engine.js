'use strict'

const git = require("./lib/config/git");
const pg = require("./lib/config/pg");
const redis = require("./lib/config/redis");
const user = require("./lib/config/user");
const repo = require("./lib/config/repo");
const web = require("./lib/config/web");
const gitService = require("./lib/config/git-service");
const privateAPI = require("./lib/config/private-api");

const exitIfInvalidConfigs = () => {
    pg.exitIfInvalidPGConfig();
    redis.exitIfInvalidRedisConfig();
    git.exitIfInvalidGitConfig();
    repo.exitIfInvalidRepoConfig();
    user.exitIfInvalidUserConfig();
    web.exitIfInvalidWebConfig();
    gitService.exitIfInvalidGitServiceConfig();
    privateAPI.exitIfInvalidPrivateAPIConfig();
}

module.exports = {
    exitIfInvalidConfigs: exitIfInvalidConfigs,
    exitIfInvalidRepoConfig: repo.exitIfInvalidRepoConfig,
    exitIfInvalidUserConfig: user.exitIfInvalidUserConfig,
    exitIfInvalidPGConfig: pg.exitIfInvalidPGConfig,
    exitIfInvalidRedisConfig: redis.exitIfInvalidRedisConfig,
    exitIfInvalidGitConfig: git.exitIfInvalidGitConfig,
    exitIfInvalidWebConfig: web.exitIfInvalidWebConfig,
    exitIfInvalidGitServiceConfig: gitService.exitIfInvalidGitServiceConfig,
    exitIfInvalidPrivateAPIConfig: privateAPI.exitIfInvalidPrivateAPIConfig,
    getRepoConfig: repo.getRepoConfig,
    getUserConfig: user.getUserConfig,
    getGitConfig: git.getGitConfig,
    getPGConfig: pg.getPGConfig,
    getRedisConfig: redis.getRedisConfig,
    getWebConfig: web.getWebConfig,
    getGitServiceConfig: gitService.getGitServiceConfig,
    getPrivateAPIConfig: privateAPI.getPrivateAPIConfig
}
