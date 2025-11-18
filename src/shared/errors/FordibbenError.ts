import { AppError } from './AppError';

/**
*Error de acceso prohibido
*Se lanza cuando un usuario autenticado intenta acceder
*a un recurso para el cual no tiene los permisos necesarios
*/
export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}