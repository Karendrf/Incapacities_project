export declare class Logger {
    private context;
    constructor(context: string);
    private formatMessage;
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map