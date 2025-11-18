import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../../shared/errors/AppError';
import { Logger } from '../../../../shared/utils/logger';

/**
 * Middleware centralizado para manejo de errores en la aplicación
 * Captura excepciones y devuelve respuestas JSON estandarizadas
 */
export class ErrorHandler {
  private static readonly logger = new Logger('ErrorHandler');

  /**
   * Middleware principal de manejo de errores
   * Determina el tipo de error y construye la respuesta adecuada
   */
  public static handle(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    ErrorHandler.logger.error('Error occurred', err);
    //Manejo de errores personalizados basados en AppError
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
    //Manejo de errores de validación de Sequelize
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
    //Manejo de errores por violación de restricciones únicas
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
    //Manejo de errores por violación de claves foráneas
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
    //Manejo de errores no controlados
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
