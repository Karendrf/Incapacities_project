"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const logger_1 = require("../../../shared/utils/logger");
const logger = new logger_1.Logger('DatabaseSync');
async function syncDatabase() {
    try {
        logger.info('Starting database synchronization...');
        const db = database_1.Database.getInstance();
        //const sequelize = db.getSequelize();
        // Test connection
        const connected = await db.testConnection();
        if (!connected) {
            throw new Error('Could not connect to database');
        }
        // Initialize models and sync
        await db.initialize();
        logger.info('Database synchronization completed successfully');
        process.exit(0);
    }
    catch (error) {
        logger.error('Database synchronization failed', error);
        process.exit(1);
    }
}
syncDatabase();
//# sourceMappingURL=sync.js.map