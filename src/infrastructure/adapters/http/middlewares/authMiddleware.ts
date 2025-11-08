import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/errors/FordibbenError';
import { serverConfig } from '../../../config/server.config';
import { Logger } from '../../../../shared/utils/logger';

export interface JwtPayload {
  userId: string;
  role: string;
  document: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
  private static readonly logger = new Logger('AuthMiddleware');

  public static authenticate(req: Request, _res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError('Token de autenticación no proporcionado');
      }

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;

      if (!token) {
        throw new UnauthorizedError('Formato de token inválido');
      }

      const decoded = jwt.verify(token, serverConfig.jwtSecret) as JwtPayload;
      req.user = decoded;

      AuthMiddleware.logger.debug('User authenticated', { 
        userId: decoded.userId, 
        role: decoded.role 
      });
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError('Token inválido'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token expirado'));
      } else {
        next(error);
      }
    }
  }

  public static requireAdmin(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (req.user.role !== 'administrador') {
      return next(
        new ForbiddenError('Acceso denegado. Se requiere rol de administrador')
      );
    }

    AuthMiddleware.logger.debug('Admin access granted', { userId: req.user.userId });
    next();
  }
}