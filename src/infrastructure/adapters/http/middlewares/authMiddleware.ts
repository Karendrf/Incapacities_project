import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../shared/errors/UnauthorizedError';
import { ForbiddenError } from '../../../../shared/errors/FordibbenError';
import { serverConfig } from '../../../config/server.config';
import { Logger } from '../../../../shared/utils/logger';
import { IPayrollRepository } from '../../../../application/ports/out/IPayrollRepository';

/**
 * Payload esperado dentro del token JWT
 */
export interface JwtPayload {
  userId: string;
  role: string;
  document: string;
  iat?: number;
  exp?: number;
}
//Agrega el campo "user" al Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware encargado de autenticación y autorización
 */
export class AuthMiddleware {
  private static readonly logger = new Logger('AuthMiddleware');
  private static payrollRepository?: IPayrollRepository;

  /**
   * Configura el repositorio para validar si un usuario es dueño del recurso
   */
  public static configure(repository: IPayrollRepository): void {
    this.payrollRepository = repository;
  }

  /**
   * Verifica que el token JWT exista, sea válido y decodifica sus datos
   */
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
      if (!decoded.userId || !decoded.role || !decoded.document) {
        throw new UnauthorizedError('Token inválido: datos incompletos');
      }
      req.user = decoded;
      AuthMiddleware.logger.debug('Usuario autenticado', {
        userId: decoded.userId,
        role: decoded.role,
      });
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError('Token inválido'));
      } else if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token expirado. Por favor, inicie sesión nuevamente'));
      } else {
        next(error);
      }
    }
  }

  /**
   * Permite acceso solo si el usuario tiene rol de administrador
   */
  public static requireAdmin(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }
    if (req.user.role !== 'administrador') {
      AuthMiddleware.logger.warn('Acceso denegado - rol insuficiente', {
        userId: req.user.userId,
        role: req.user.role,
      });
      return next(
        new ForbiddenError('Acceso denegado. Se requiere rol de administrador')
      );
    }
    next();
  }

  /**
   * Permite acceso a usuarios con rol "empleado" o "administrador"
   */
  public static requireEmployee(req: Request, _res: Response, next: NextFunction): void {
    if (!req.user) {
      return next(new UnauthorizedError('Usuario no autenticado'));
    }
    if (req.user.role !== 'empleado' && req.user.role !== 'administrador') {
      return next(
        new ForbiddenError('Acceso denegado. Se requiere rol de empleado o administrador')
      );
    }
    next();
  }

  /**
   * Permite acceso si:
   *  - el usuario es administrador, o
   *  - es propietario del recurso (nómina o documento)
   */
  public static requireOwnerOrAdmin(resourceType: 'payroll' | 'document') {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      try {
        if (!req.user) {
          return next(new UnauthorizedError('Usuario no autenticado'));
        }
        if (req.user.role === 'administrador') {
          return next();
        }
        const isOwner = await AuthMiddleware.validateOwnership(req, resourceType);
        if (!isOwner) {
          return next(
            new ForbiddenError('No tiene permisos para acceder a este recurso')
          );
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Comprueba si el usuario autenticado es dueño del recurso solicitado
   */
  private static async validateOwnership(
    req: Request,
    resourceType: 'payroll' | 'document'
  ): Promise<boolean> {
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
        if (!payroll) return false;
        return payroll.userDocument === req.user.document;
      }
      return false;
    } catch (error) {
      AuthMiddleware.logger.error('Error validando propiedad del recurso', error as Error);
      return false;
    }
  }

  /**
   * Verifica el token solo si viene en la petición
   * Si no viene, continúa sin error
   */
  public static optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }
    try {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : authHeader;
      if (token) {
        const decoded = jwt.verify(token, serverConfig.jwtSecret) as JwtPayload;
        req.user = decoded;
      }
    } catch (_error) {
      AuthMiddleware.logger.debug('Token opcional inválido o expirado');
    }
    next();
  }
}