import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../../../shared/utils/logger';
export class RequestLogger {
  private static readonly logger = new Logger('RequestLogger');
  public static log(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now(); 
    res.on('finish', () => {
      const duration = Date.now() - start;
      RequestLogger.logger.info(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
      );
    });
    next();
  }
}
