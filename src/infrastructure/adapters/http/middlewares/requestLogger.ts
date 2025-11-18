import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../../shared/utils/logger';

/**
 * Middleware que registra cada petición realizada al servidor
 * Guarda método, URL, código de respuesta y el tiempo que tardó en procesarse
 */
export class RequestLogger {
  private static readonly logger = new Logger('RequestLogger');

  /**
   * Middleware principal que mide y registra la información de la petición
   */
  public static log(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now(); // Momento en que inicia la petición

    // Cuando la respuesta finaliza, se registra la información
    res.on('finish', () => {
      const duration = Date.now() - start;

      RequestLogger.logger.info(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });

    next(); // Continúa con el siguiente middleware
  }
}
