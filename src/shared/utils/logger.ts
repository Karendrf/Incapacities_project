/**
 * Logger de la aplicacióProporciona métodos para registrar mensajes con diferentes
 * niveles de severidad para facilitar el seguimiento y depuración
*/
export class Logger {
  private context: string;
  constructor(context: string) {
    this.context = context;
  }

  //Formatea el mensaje con timestamp, nivel y contexto
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  //Registra un mensaje informativo
  public info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('INFO', message), ...args);
  }

  //Registra un mensaje de error con stack trace opcional
  public error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error('Stack trace:', error.stack);
    }
  }

  //Registra un mensaje de advertencia 
  public warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('WARN', message), ...args);
  }

  //Registra un mensaje de depuración (solo en desarrollo) 
  public debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}