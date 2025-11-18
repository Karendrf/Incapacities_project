import { AppError } from './AppError';
export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}