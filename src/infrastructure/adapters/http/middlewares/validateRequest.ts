import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../../../../shared/errors/ValidationError';

export class ValidateRequest {
  /**
   * Middleware que valida la petición usando express-validator
   * Ejecuta todas las validaciones y si existe un error, lanza una excepción con los mensajes de validación
   */
  public static validate(validations: ValidationChain[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      await Promise.all(validations.map(validation => validation.run(req)));
      const errors = validationResult(req);
      // Si no hay errores → continuar
      if (errors.isEmpty()) {
        return next();
      }
      // Convertir errores en un solo mensaje
      const errorMessages = errors.array().map(err => err.msg).join(', ');
      // Lanzar error de validación
      next(new ValidationError(errorMessages));
    };
  }
}
