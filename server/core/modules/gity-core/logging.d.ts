// Type definitions for logging
/// <reference types="node" />

export function setPreifx(prefix: string): void;
export function red(str: string): string;
export function green(str: string): string;
export function yellow(str: string): string;
export function magenta(str: string): string;
export function teal(str: string): string;
export function logInfo(str: string): void;
export function logErr(str: string): void;
export function logWarn(str: string): void;
