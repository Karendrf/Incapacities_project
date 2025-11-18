"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../../config/database.config");
const models_1 = require("./models");
const logger_1 = require("../../../shared/utils/logger");
class Database {
    constructor() {
        this.logger = new logger_1.Logger('Database');
        this.sequelize = new sequelize_1.Sequelize(database_config_1.databaseConfig);
        this.setupEventListeners();
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    setupEventListeners() {
        this.logger.info('Configuración de base de datos cargada', {
            host: database_config_1.databaseConfig.host,
            database: database_config_1.databaseConfig.database,
            dialect: database_config_1.databaseConfig.dialect,
        });
    }
    getSequelize() {
        return this.sequelize;
    }
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            this.logger.info('Conexión a base de datos establecida exitosamente');
            return true;
        }
        catch (error) {
            this.logger.error('No se pudo conectar a la base de datos', error);
            return false;
        }
    }
    async initialize() {
        try {
            (0, models_1.initModels)(this.sequelize);
            this.logger.info('Modelos inicializados exitosamente');
            if (process.env.NODE_ENV === 'development') {
                await this.sequelize.sync({
                    alter: true,
                    force: false
                });
                this.logger.info('Base de datos sincronizada exitosamente');
            }
            else {
                await this.sequelize.authenticate();
                this.logger.info('Base de datos verificada exitosamente');
            }
            await this.seedCompanies();
        }
        catch (error) {
            this.logger.error('Error inicializando base de datos', error);
            throw error;
        }
    }
    async seedCompanies() {
        try {
            const count = await models_1.CompanyModel.count();
            if (count === 0) {
                this.logger.info('Creando empresas de prueba...');
                const companies = [
                    {
                        name: 'Tech Solutions S.A.S',
                        nit: '900123456-7',
                        address: 'Calle 100 #10-20, Bogotá',
                        phone: '+57 1 234 5678',
                    },
                    {
                        name: 'Innovación Digital Ltda',
                        nit: '800987654-3',
                        address: 'Carrera 15 #85-40, Bogotá',
                        phone: '+57 1 876 5432',
                    },
                    {
                        name: 'Servicios Empresariales Colombia',
                        nit: '700456789-1',
                        address: 'Avenida 68 #45-30, Bogotá',
                        phone: '+57 1 345 6789',
                    },
                    {
                        name: 'Consultoría Integral S.A.',
                        nit: '600321654-9',
                        address: 'Calle 72 #10-34, Bogotá',
                        phone: '+57 1 654 3210',
                    },
                    {
                        name: 'Desarrollo y Tecnología',
                        nit: '500789123-4',
                        address: 'Carrera 7 #32-16, Bogotá',
                        phone: '+57 1 789 0123',
                    },
                ];
                await models_1.CompanyModel.bulkCreate(companies);
                this.logger.info(`${companies.length} empresas creadas exitosamente`);
            }
            else {
                this.logger.info(`Ya existen ${count} empresas en la base de datos`);
            }
        }
        catch (error) {
            this.logger.error('Error creando empresas de prueba', error);
            throw error;
        }
    }
    async close() {
        try {
            await this.sequelize.close();
            this.logger.info('Conexión a base de datos cerrada');
        }
        catch (error) {
            this.logger.error('Error cerrando conexión a base de datos', error);
            throw error;
        }
    }
    async reset() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('No se puede resetear la base de datos en producción');
        }
        try {
            this.logger.warn('Reseteando base de datos...');
            await this.sequelize.sync({ force: true });
            await this.seedCompanies();
            this.logger.info('Base de datos reseteada exitosamente');
        }
        catch (error) {
            this.logger.error('Error reseteando base de datos', error);
            throw error;
        }
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map