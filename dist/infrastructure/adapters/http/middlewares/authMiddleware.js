"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UnauthorizedError_1 = require("../../../../shared/errors/UnauthorizedError");
const FordibbenError_1 = require("../../../../shared/errors/FordibbenError");
const server_config_1 = require("../../../config/server.config");
const logger_1 = require("../../../../shared/utils/logger");
class AuthMiddleware {
    static authenticate(req, _res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new UnauthorizedError_1.UnauthorizedError('Token de autenticación no proporcionado');
            }
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.substring(7)
                : authHeader;
            if (!token) {
                throw new UnauthorizedError_1.UnauthorizedError('Formato de token inválido');
            }
            const decoded = jsonwebtoken_1.default.verify(token, server_config_1.serverConfig.jwtSecret);
            req.user = decoded;
            AuthMiddleware.logger.debug('User authenticated', {
                userId: decoded.userId,
                role: decoded.role
            });
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                next(new UnauthorizedError_1.UnauthorizedError('Token inválido'));
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                next(new UnauthorizedError_1.UnauthorizedError('Token expirado'));
            }
            else {
                next(error);
            }
        }
    }
    static requireAdmin(req, _res, next) {
        if (!req.user) {
            return next(new UnauthorizedError_1.UnauthorizedError('Usuario no autenticado'));
        }
        if (req.user.role !== 'administrador') {
            return next(new FordibbenError_1.ForbiddenError('Acceso denegado. Se requiere rol de administrador'));
        }
        AuthMiddleware.logger.debug('Admin access granted', { userId: req.user.userId });
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
AuthMiddleware.logger = new logger_1.Logger('AuthMiddleware');
//# sourceMappingURL=authMiddleware.js.map