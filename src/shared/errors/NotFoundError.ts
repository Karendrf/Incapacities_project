import { AppError } from './AppError';

/**
*Error de recurso no encontrado
*Se lanza cuando se intenta acceder a un recurso que no existe en la base de datos o en el sistema
*/
export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}