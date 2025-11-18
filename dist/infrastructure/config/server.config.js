"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.serverConfig = {
    port: parseInt(process.env.PORT || '3002', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    serviceName: process.env.SERVICE_NAME || 'payroll-service',
    logLevel: process.env.LOG_LEVEL || 'info',
};
//# sourceMappingURL=server.config.js.map