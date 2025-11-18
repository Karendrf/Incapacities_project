"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const AppError_1 = require("../../../../shared/errors/AppError");
const logger_1 = require("../../../../shared/utils/logger");
class ErrorHandler {
    static handle(err, _req, res, _next) {
        ErrorHandler.logger.error('Error occurred', err);
        if (err instanceof AppError_1.AppError) {
            res.status(err.statusCode).json({
                success: false,
                error: {
                    message: err.message,
                    statusCode: err.statusCode,
                },
            });
            return;
        }
        if (err.name === 'SequelizeValidationError') {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Error de validación en los datos',
                    statusCode: 400,
                    details: err.message,
                },
            });
            return;
        }
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({
                success: false,
                error: {
                    message: 'El registro ya existe',
                    statusCode: 409,
                },
            });
            return;
        }
        if (err.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Error de referencia: el registro relacionado no existe',
                    statusCode: 400,
                },
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: {
                message: process.env.NODE_ENV === 'production'
                    ? 'Error interno del servidor'
                    : err.message,
                statusCode: 500,
            },
        });
    }
}
exports.ErrorHandler = ErrorHandler;
ErrorHandler.logger = new logger_1.Logger('ErrorHandler');
//# sourceMappingURL=errorHandler.js.map