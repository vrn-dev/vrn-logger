type ColorTextFn = (text: string) => string;

const isColorAllowed = () => process.env.NO_COLOR;
const colorIfAllowed = (colorFn: ColorTextFn) => (text: string) => isColorAllowed() ? colorFn(text) : text;

const clcN = {
  bold: colorIfAllowed((text: string) => `\x1B[1m${text}\x1B[0m`),
  green: colorIfAllowed((text: string) => `\x1B[32m${text}\x1B[39m`),
  yellow: colorIfAllowed((text: string) => `\x1B[33m${text}\x1B[39m`),
  red: colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`),
  magentaBright: colorIfAllowed((text: string) => `\x1B[95m${text}\x1B[39m`),
  cyanBright: colorIfAllowed((text: string) => `\x1B[96m${text}\x1B[39m`),
};

export const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

export const yellow = (text: string) => `\x1B[38;5;3m${text}\x1B[39m`;

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  verbose: 0,
  debug: 1,
  log: 2,
  warn: 3,
  error: 4,
};

/**
 * Checks if target level is enabled.
 * @param targetLevel target level
 * @param logLevels array of enabled log levels
 */
export function isLogLevelEnabled(
  targetLevel: LogLevel,
  logLevels: LogLevel[] | undefined,
): boolean {
  if (!logLevels || (Array.isArray(logLevels) && logLevels?.length === 0)) {
    return false;
  }
  if (logLevels.includes(targetLevel)) {
    return true;
  }
  const highestLogLevelValue = logLevels
    .map(level => LOG_LEVEL_VALUES[level])
    .sort((a, b) => b - a)?.[0];

  const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
  return targetLevelValue >= highestLogLevelValue;
}

export const isUndefined = (obj: any): obj is undefined =>
  typeof obj === 'undefined';
export const isFunction = (val: any): val is Function =>
  typeof val === 'function';
export const isString = (val: any): val is string => typeof val === 'string';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isConstructor = (val: any): boolean => val === 'constructor';
export const isNil = (val: any): val is null | undefined =>
  isUndefined(val) || val === null;
export const isEmpty = (array: any): boolean => !(array && array.length > 0);
export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';
export const isObject = (fn: any): fn is object =>
  !isNil(fn) && typeof fn === 'object';
export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
    Function.prototype.toString.call(Object)
  );
};