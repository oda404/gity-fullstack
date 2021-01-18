
interface Group
{
    alias: string;
    name: string;
};

export interface PGConfig
{
    host: string;
    port: number;
    databases: Group[],
    users: Group[]
};

export interface RedisConfig
{
    host: string;
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
}

export function getRepoConfig():  RepoConfig;
export function getUserConfig():  UserConfig;
export function getGitConfig():   GitConfig;
export function getPGConfig():    PGConfig;
export function getRedisConfig(): RedisConfig;

export function validateConfigurations():     void;
export function validateRepoConfiguration():  void;
export function validateUserConfiguration():  void;
export function validatePGConfiguration():    void;
export function validateRedisConfiguration(): void;
export function validateGitConfiguration():   void;
