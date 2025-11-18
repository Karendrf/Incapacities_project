import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../../shared/errors/AppError';
import { Logger } from '../../../../shared/utils/logger';
export class ErrorHandler {
  private static readonly logger = new Logger('ErrorHandler');
  public static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    ErrorHandler.logger.error('Error occurred', err);
    if (err instanceof AppError) {
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
        message:
          process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor'
            : err.message,
        statusCode: 500,
      },
    });
  }
}
