import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/errors/FordibbenError';
import { serverConfig } from '../../../config/server.config';

export interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export class AuthMiddleware {
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
      
      if (!decoded.id || !decoded.role) {
        throw new UnauthorizedError('Token inválido: datos incompletos');
      }

      req.user = decoded;
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

    if (req.user.role.toUpperCase() !== 'ADMIN') {
      return next(new ForbiddenError('Acceso denegado. Se requiere rol de administrador'));
    }

    next();
  }

  public static requireEmployee(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    next();
  }

  public static requireOwnerOrAdmin(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }

    if (req.user.role.toUpperCase() === 'ADMIN') {
      return next();
    }

    const requestedUserId = req.params.userId;
    const requestedId = req.params.id;

    if (requestedUserId && req.user.id.toString() !== requestedUserId) {
      return next(new ForbiddenError('Acceso denegado'));
    }

    if (requestedId && req.user.id.toString() !== requestedId) {
      return next(new ForbiddenError('Acceso denegado'));
    }

    next();
  }
}
