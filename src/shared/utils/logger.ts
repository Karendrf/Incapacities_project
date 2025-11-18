export class Logger {
  private context: string;
  constructor(context: string) {
    this.context = context;
  }
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }
  public info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('INFO', message), ...args);
  }
  public error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message));
    if (error) {
      console.error('Stack trace:', error.stack);
    }
  }
  public warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('WARN', message), ...args);
  }
  public debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
}