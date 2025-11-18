"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLogger = void 0;
const logger_1 = require("../../../../shared/utils/logger");
class RequestLogger {
    static log(req, res, next) {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            RequestLogger.logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        });
        next();
    }
}
exports.RequestLogger = RequestLogger;
RequestLogger.logger = new logger_1.Logger('RequestLogger');
//# sourceMappingURL=requestLogger.js.map