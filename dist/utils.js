"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPlainObject = exports.isObject = exports.isSymbol = exports.isEmpty = exports.isNil = exports.isConstructor = exports.isNumber = exports.isString = exports.isFunction = exports.isUndefined = exports.isLogLevelEnabled = exports.yellow = exports.clc = void 0;
const isColorAllowed = () => process.env.NO_COLOR;
const colorIfAllowed = (colorFn) => (text) => isColorAllowed() ? colorFn(text) : text;
const clcN = {
    bold: colorIfAllowed((text) => `\x1B[1m${text}\x1B[0m`),
    green: colorIfAllowed((text) => `\x1B[32m${text}\x1B[39m`),
    yellow: colorIfAllowed((text) => `\x1B[33m${text}\x1B[39m`),
    red: colorIfAllowed((text) => `\x1B[31m${text}\x1B[39m`),
    magentaBright: colorIfAllowed((text) => `\x1B[95m${text}\x1B[39m`),
    cyanBright: colorIfAllowed((text) => `\x1B[96m${text}\x1B[39m`),
};
exports.clc = {
    bold: (text) => `\x1B[1m${text}\x1B[0m`,
    green: (text) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text) => `\x1B[33m${text}\x1B[39m`,
    red: (text) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text) => `\x1B[96m${text}\x1B[39m`,
};
const yellow = (text) => `\x1B[38;5;3m${text}\x1B[39m`;
exports.yellow = yellow;
const LOG_LEVEL_VALUES = {
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
function isLogLevelEnabled(targetLevel, logLevels) {
    var _a;
    if (!logLevels || (Array.isArray(logLevels) && (logLevels === null || logLevels === void 0 ? void 0 : logLevels.length) === 0)) {
        return false;
    }
    if (logLevels.includes(targetLevel)) {
        return true;
    }
    const highestLogLevelValue = (_a = logLevels
        .map(level => LOG_LEVEL_VALUES[level])
        .sort((a, b) => b - a)) === null || _a === void 0 ? void 0 : _a[0];
    const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
    return targetLevelValue >= highestLogLevelValue;
}
exports.isLogLevelEnabled = isLogLevelEnabled;
const isUndefined = (obj) => typeof obj === 'undefined';
exports.isUndefined = isUndefined;
const isFunction = (val) => typeof val === 'function';
exports.isFunction = isFunction;
const isString = (val) => typeof val === 'string';
exports.isString = isString;
const isNumber = (val) => typeof val === 'number';
exports.isNumber = isNumber;
const isConstructor = (val) => val === 'constructor';
exports.isConstructor = isConstructor;
const isNil = (val) => (0, exports.isUndefined)(val) || val === null;
exports.isNil = isNil;
const isEmpty = (array) => !(array && array.length > 0);
exports.isEmpty = isEmpty;
const isSymbol = (val) => typeof val === 'symbol';
exports.isSymbol = isSymbol;
const isObject = (fn) => !(0, exports.isNil)(fn) && typeof fn === 'object';
exports.isObject = isObject;
const isPlainObject = (fn) => {
    if (!(0, exports.isObject)(fn)) {
        return false;
    }
    const proto = Object.getPrototypeOf(fn);
    if (proto === null) {
        return true;
    }
    const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
        proto.constructor;
    return (typeof ctor === 'function' &&
        ctor instanceof ctor &&
        Function.prototype.toString.call(ctor) ===
            Function.prototype.toString.call(Object));
};
exports.isPlainObject = isPlainObject;
