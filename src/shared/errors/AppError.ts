/**
*Error personalizado de la aplicación
*Extiende la clase Error nativa para incluir información adicional como
*código de estado HTTP y si el error es operacional (esperado) o de programación
*permitiendo un manejo de errores más específico y consistente en toda la aplicación
*/
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}