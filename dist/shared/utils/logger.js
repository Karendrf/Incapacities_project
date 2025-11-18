"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(context) {
        this.context = context;
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.context}] ${message}`;
    }
    info(message, ...args) {
        console.log(this.formatMessage('INFO', message), ...args);
    }
    error(message, error) {
        console.error(this.formatMessage('ERROR', message));
        if (error) {
            console.error('Stack trace:', error.stack);
        }
    }
    warn(message, ...args) {
        console.warn(this.formatMessage('WARN', message), ...args);
    }
    debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('DEBUG', message), ...args);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map