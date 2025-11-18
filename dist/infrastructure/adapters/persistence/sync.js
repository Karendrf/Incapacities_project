"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const logger_1 = require("../../../shared/utils/logger");
const logger = new logger_1.Logger('DatabaseSync');
async function syncDatabase() {
    try {
        logger.info('Iniciando la sincronización de la base de datos...');
        const db = database_1.Database.getInstance();
        const connected = await db.testConnection();
        if (!connected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        await db.initialize();
        logger.info('Base de datos sincronizada correctamente');
        process.exit(0);
    }
    catch (error) {
        logger.error('La sincronización con la base de datos falló', error);
        process.exit(1);
    }
}
syncDatabase();
//# sourceMappingURL=sync.js.map