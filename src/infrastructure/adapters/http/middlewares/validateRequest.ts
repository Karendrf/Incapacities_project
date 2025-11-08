import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../../../../shared/errors/ValidationError';

export class ValidateRequest {
  public static validate(validations: ValidationChain[]) {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      const errorMessages = errors.array().map(err => err.msg).join(', ');
      next(new ValidationError(errorMessages));
    };
  }
}