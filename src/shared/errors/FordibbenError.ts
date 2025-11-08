import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}