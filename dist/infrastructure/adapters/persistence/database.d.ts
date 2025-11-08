import { Sequelize } from 'sequelize';
export declare class Database {
    private static instance;
    private sequelize;
    private readonly logger;
    private constructor();
    static getInstance(): Database;
    private setupEventListeners;
    getSequelize(): Sequelize;
    testConnection(): Promise<boolean>;
    initialize(): Promise<void>;
    private seedCompanies;
    close(): Promise<void>;
    transaction<T>(callback: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=database.d.ts.map