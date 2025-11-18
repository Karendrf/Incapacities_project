import { AppError } from './AppError';

/**
*Error de no autorizado
*Se lanza cuando un usuario no está autenticado o sus credenciales son inválidas
*/
export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}