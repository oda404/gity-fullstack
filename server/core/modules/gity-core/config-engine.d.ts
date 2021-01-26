// Type definitions for config-engine
/// <reference types="node" />

interface Group
{
    alias: string;
    name: string;
};

export interface PGConfig
{
    hostname: string;
    port: number;
    databases: Group[],
    users: Group[]
};

export interface RedisConfig
{
    hostname: string;
    port: number;
};

export interface GitConfig
{
    usersRootDir: string;
};

export interface UserConfig
{
    emailB64Regex: string;
    emailMinLen: number;
    emailMaxLen: number;
    usernameB64Regex: string;
    usernameMinLen: number;
    usernameMaxLen: number;
    usernamesForbidden?: string[];
    passwdB64Regex: string;
    passwdMinLen: number;
    passwdMaxLen: number;
    passwdHashTimeCost?: number;
    passwdHashSaltLen?: number;
};

export interface RepoConfig
{
    nameB64Regex: string;
    nameMinLen: number;
    nameMaxLen: number;
    descriptionB64Regex: string;
    descriptionMinLen: number;
    descriptionMaxLen: number;
};

export interface WebConfig
{
    hostname: string;
};

export interface GitServiceConfig
{
    port: number;
};

export interface PrivateAPIConfig
{
    port: number;
}

export function getRepoConfig():  RepoConfig;
export function getUserConfig():  UserConfig;
export function getGitConfig():   GitConfig;
export function getPGConfig():    PGConfig;
export function getRedisConfig(): RedisConfig;
export function getWebConfig():   WebConfig;
export function getGitServiceConfig(): GitServiceConfig;
export function getPrivateAPIConfig(): PrivateAPIConfig;

export function exitIfInvalidConfigs():     void;
export function exitIfInvalidRepoConfig():  void;
export function exitIfInvalidUserConfig():  void;
export function exitIfInvalidPGConfig():    void;
export function exitIfInvalidRedisConfig(): void;
export function exitIfInvalidGitConfig():   void;
export function exitIfInvalidWebConfig():   void;
export function exitIfInvalidGitServiceConfig(): void;
export function exitIfInvalidPrivateAPIConfig(): void;
