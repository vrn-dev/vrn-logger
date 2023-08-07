"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const utils_1 = require("./utils");
const DEFAULT_LOG_LEVELS = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
];
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
});
class ConsoleLogger {
    constructor(context, options = {}) {
        this.context = context;
        this.options = options;
        if (!options.logLevels) {
            options.logLevels = DEFAULT_LOG_LEVELS;
        }
        if (context) {
            this.originalContext = context;
        }
        this.options.timestamp = true;
    }
    log(message, ...optionalParams) {
        if (!this.isLevelEnabled('log'))
            return;
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        this.printMessages(messages, context, 'log');
    }
    error(message, ...optionalParams) {
        if (!this.isLevelEnabled('error')) {
            return;
        }
        const { messages, context, stack } = this.getContextAndStackAndMessagesToPrint([message, ...optionalParams]);
        this.printMessages(messages, context, 'error', 'stderr');
        this.printStackTrace(stack);
    }
    warn(message, ...optionalParams) {
        if (!this.isLevelEnabled('warn')) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        this.printMessages(messages, context, 'warn');
    }
    debug(message, ...optionalParams) {
        if (!this.isLevelEnabled('debug')) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        this.printMessages(messages, context, 'debug');
    }
    verbose(message, ...optionalParams) {
        if (!this.isLevelEnabled('verbose')) {
            return;
        }
        const { messages, context } = this.getContextAndMessagesToPrint([
            message,
            ...optionalParams,
        ]);
        this.printMessages(messages, context, 'verbose');
    }
    /**
     * Set log levels
     * @param levels log levels
     */
    setLogLevels(levels) {
        if (!this.options) {
            this.options = {};
        }
        this.options.logLevels = levels;
    }
    /**
     * Set logger context
     * @param context context
     */
    setContext(context) {
        this.context = context;
    }
    /**
     * Resets the logger context to the value that was passed in the constructor.
     */
    resetContext() {
        this.context = this.originalContext;
    }
    isLevelEnabled(level) {
        var _a;
        const logLevels = (_a = this.options) === null || _a === void 0 ? void 0 : _a.logLevels;
        return (0, utils_1.isLogLevelEnabled)(level, logLevels);
    }
    getContextAndMessagesToPrint(args) {
        if ((args === null || args === void 0 ? void 0 : args.length) <= 1) {
            return { messages: args, context: this.context };
        }
        const lastElement = args[args.length - 1];
        const isContext = (0, utils_1.isString)(lastElement);
        if (!isContext) {
            return { messages: args, context: this.context };
        }
        return {
            context: lastElement,
            messages: args.slice(0, args.length - 1),
        };
    }
    printMessages(messages, context = '', logLevel = 'log', writeStreamType) {
        messages.forEach((msg) => {
            const pidMessage = this.formatPid(process.pid);
            const contextMessage = this.formatContext(context);
            const timestampDiff = this.updateAndGetTimestampDiff();
            const formattedLogLevel = logLevel.toUpperCase().padStart(7, '');
            const formattedMessage = this.formatMessage(logLevel, msg, pidMessage, formattedLogLevel, contextMessage, timestampDiff);
            process[writeStreamType !== null && writeStreamType !== void 0 ? writeStreamType : 'stdout'].write(formattedMessage);
        });
    }
    formatPid(pid) {
        return `[HookZ] ${pid}  - `;
    }
    formatContext(context) {
        return context ? (0, utils_1.yellow)(`[${context}] `) : '';
    }
    formatMessage(logLevel, message, pidMessage, formattedLogLevel, contextMessage, timestampDiff) {
        const output = this.stringifyMessage(message, logLevel);
        pidMessage = this.colorize(pidMessage, logLevel);
        formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
        return `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
    }
    getTimestamp() {
        return dateTimeFormatter.format(Date.now());
    }
    updateAndGetTimestampDiff() {
        var _a;
        const includeTimestamp = ConsoleLogger.lastTimestampAt && ((_a = this.options) === null || _a === void 0 ? void 0 : _a.timestamp);
        const result = includeTimestamp
            ? this.formatTimestampDiff(Date.now() - ConsoleLogger.lastTimestampAt)
            : '';
        ConsoleLogger.lastTimestampAt = Date.now();
        return result;
    }
    formatTimestampDiff(timestampDiff) {
        return (0, utils_1.yellow)(` +${timestampDiff}ms`);
    }
    stringifyMessage(message, logLevel) {
        // If the message is a function, call it and re-resolve its value.
        return (0, utils_1.isFunction)(message)
            ? this.stringifyMessage(message(), logLevel)
            : (0, utils_1.isPlainObject)(message) || Array.isArray(message)
                ? `${this.colorize('Object:', logLevel)}\n${JSON.stringify(message, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2)}\n`
                : this.colorize(message, logLevel);
    }
    colorize(message, logLevel) {
        const color = this.getColorByLogLevel(logLevel);
        return color(message);
    }
    printStackTrace(stack) {
        if (!stack) {
            return;
        }
        process.stderr.write(`${stack}\n`);
    }
    getContextAndStackAndMessagesToPrint(args) {
        if (args.length === 2) {
            return this.isStackFormat(args[1])
                ? {
                    messages: [args[0]],
                    stack: args[1],
                    context: this.context,
                }
                : {
                    messages: [args[0]],
                    context: args[1],
                };
        }
        const { messages, context } = this.getContextAndMessagesToPrint(args);
        if ((messages === null || messages === void 0 ? void 0 : messages.length) <= 1) {
            return { messages, context };
        }
        const lastElement = messages[messages.length - 1];
        const isStack = (0, utils_1.isString)(lastElement);
        // https://github.com/nestjs/nest/issues/11074#issuecomment-1421680060
        if (!isStack && !(0, utils_1.isUndefined)(lastElement)) {
            return { messages, context };
        }
        return {
            stack: lastElement,
            messages: messages.slice(0, messages.length - 1),
            context,
        };
    }
    isStackFormat(stack) {
        if (!(0, utils_1.isString)(stack) && !(0, utils_1.isUndefined)(stack)) {
            return false;
        }
        return /^(.)+\n\s+at .+:\d+:\d+$/.test(stack);
    }
    getColorByLogLevel(level) {
        switch (level) {
            case 'debug':
                return utils_1.clc.magentaBright;
            case 'warn':
                return utils_1.clc.yellow;
            case 'error':
                return utils_1.clc.red;
            case 'verbose':
                return utils_1.clc.cyanBright;
            default:
                return utils_1.clc.green;
        }
    }
}
exports.ConsoleLogger = ConsoleLogger;
