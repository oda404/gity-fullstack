
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_MAX_LENGTH = 80;

export const USERNAME_REGEX = /^[a-zA-Z0-9\-_]*$/;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 35;
export const FORBIDDEN_USERNAMES = [
    "new",
    "404",
    "login",
    "register",
    "tos"
];

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 80;
export const PASSWORD_REGEX = /^.*(?=.{8,80})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+[{\]\};:'",<.>/?\\|`~]).*$/;
