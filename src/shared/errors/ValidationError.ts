import { AppError } from './AppError';

/**
*Error de validación
*Se lanza cuando los datos enviados por el usuario 
*no cumplen con las reglas de validación requeridas
*/
export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}