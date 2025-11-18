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
    static configure(repository) {
        this.payrollRepository = repository;
    }
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
            if (!decoded.userId || !decoded.role || !decoded.document) {
                throw new UnauthorizedError_1.UnauthorizedError('Token inválido: datos incompletos');
            }
            req.user = decoded;
            AuthMiddleware.logger.debug('Usuario autenticado', {
                userId: decoded.userId,
                role: decoded.role,
            });
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                next(new UnauthorizedError_1.UnauthorizedError('Token inválido'));
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                next(new UnauthorizedError_1.UnauthorizedError('Token expirado. Por favor, inicie sesión nuevamente'));
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
            AuthMiddleware.logger.warn('Acceso denegado - rol insuficiente', {
                userId: req.user.userId,
                role: req.user.role,
            });
            return next(new FordibbenError_1.ForbiddenError('Acceso denegado. Se requiere rol de administrador'));
        }
        next();
    }
    static requireEmployee(req, _res, next) {
        if (!req.user) {
            return next(new UnauthorizedError_1.UnauthorizedError('Usuario no autenticado'));
        }
        if (req.user.role !== 'empleado' && req.user.role !== 'administrador') {
            return next(new FordibbenError_1.ForbiddenError('Acceso denegado. Se requiere rol de empleado o administrador'));
        }
        next();
    }
    static requireOwnerOrAdmin(resourceType) {
        return async (req, _res, next) => {
            try {
                if (!req.user) {
                    return next(new UnauthorizedError_1.UnauthorizedError('Usuario no autenticado'));
                }
                if (req.user.role === 'administrador') {
                    return next();
                }
                const isOwner = await AuthMiddleware.validateOwnership(req, resourceType);
                if (!isOwner) {
                    return next(new FordibbenError_1.ForbiddenError('No tiene permisos para acceder a este recurso'));
                }
                next();
            }
            catch (error) {
                next(error);
            }
        };
    }
    static async validateOwnership(req, resourceType) {
        if (!req.user || !this.payrollRepository) {
            return false;
        }
        try {
            if (resourceType === 'document') {
                return req.user.document === req.params.document;
            }
            if (resourceType === 'payroll') {
                const payrollId = parseInt(req.params.id, 10);
                const payroll = await this.payrollRepository.findById(payrollId);
                if (!payroll)
                    return false;
                return payroll.userDocument === req.user.document;
            }
            return false;
        }
        catch (error) {
            AuthMiddleware.logger.error('Error validando propiedad del recurso', error);
            return false;
        }
    }
    static optionalAuthenticate(req, _res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        try {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.substring(7)
                : authHeader;
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, server_config_1.serverConfig.jwtSecret);
                req.user = decoded;
            }
        }
        catch (_error) {
            AuthMiddleware.logger.debug('Token opcional inválido o expirado');
        }
        next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
AuthMiddleware.logger = new logger_1.Logger('AuthMiddleware');
//# sourceMappingURL=authMiddleware.js.map