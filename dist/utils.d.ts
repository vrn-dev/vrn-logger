export declare const clc: {
    bold: (text: string) => string;
    green: (text: string) => string;
    yellow: (text: string) => string;
    red: (text: string) => string;
    magentaBright: (text: string) => string;
    cyanBright: (text: string) => string;
};
export declare const yellow: (text: string) => string;
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
/**
 * Checks if target level is enabled.
 * @param targetLevel target level
 * @param logLevels array of enabled log levels
 */
export declare function isLogLevelEnabled(targetLevel: LogLevel, logLevels: LogLevel[] | undefined): boolean;
export declare const isUndefined: (obj: any) => obj is undefined;
export declare const isFunction: (val: any) => val is Function;
export declare const isString: (val: any) => val is string;
export declare const isNumber: (val: any) => val is number;
export declare const isConstructor: (val: any) => boolean;
export declare const isNil: (val: any) => val is null | undefined;
export declare const isEmpty: (array: any) => boolean;
export declare const isSymbol: (val: any) => val is symbol;
export declare const isObject: (fn: any) => fn is object;
export declare const isPlainObject: (fn: any) => fn is object;
