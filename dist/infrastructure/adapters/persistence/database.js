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
        this.logger.info('Database configuration loaded');
    }
    getSequelize() {
        return this.sequelize;
    }
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            this.logger.info('Database connection has been established successfully');
            return true;
        }
        catch (error) {
            this.logger.error('Unable to connect to the database', error);
            return false;
        }
    }
    async initialize() {
        try {
            // Initialize models
            (0, models_1.initModels)(this.sequelize);
            this.logger.info('Models initialized successfully');
            // Sync database
            await this.sequelize.sync({ alter: false });
            this.logger.info('Database synchronized successfully');
            // Seed companies
            await this.seedCompanies();
            // Seed auth users (NUEVO)
            await this.seedAuthUsers();
        }
        catch (error) {
            this.logger.error('Error initializing database', error);
            throw error;
        }
    }
    async seedCompanies() {
        try {
            const count = await models_1.CompanyModel.count();
            if (count === 0) {
                this.logger.info('Seeding companies...');
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
                this.logger.info(`${companies.length} companies seeded successfully`);
            }
        }
        catch (error) {
            this.logger.error('Error seeding companies', error);
        }
    }
    // NUEVO: Seed de usuarios de prueba
    async seedAuthUsers() {
        try {
            const count = await models_1.AuthUserModel.count();
            if (count === 0) {
                this.logger.info('Seeding auth users...');
                const users = [
                    {
                        username: 'admin',
                        password: 'admin123', // En producción usa bcrypt
                        role: 'administrador',
                        document: '1234567890',
                        name: 'Administrador Principal',
                    },
                    {
                        username: 'empleado1',
                        password: 'emp123',
                        role: 'empleado',
                        document: '9876543210',
                        name: 'Juan Empleado',
                    },
                ];
                await models_1.AuthUserModel.bulkCreate(users);
                this.logger.info(`${users.length} auth users seeded successfully`);
                // Mostrar credenciales en consola
                this.logger.info('═'.repeat(60));
                this.logger.info('USUARIOS DE PRUEBA CREADOS:');
                this.logger.info('═'.repeat(60));
                this.logger.info('ADMINISTRADOR:');
                this.logger.info('  Username: admin');
                this.logger.info('  Password: admin123');
                this.logger.info('  Role: administrador');
                this.logger.info('');
                this.logger.info('EMPLEADO:');
                this.logger.info('  Username: empleado1');
                this.logger.info('  Password: emp123');
                this.logger.info('  Role: empleado');
                this.logger.info('═'.repeat(60));
            }
        }
        catch (error) {
            this.logger.error('Error seeding auth users', error);
        }
    }
    async close() {
        try {
            await this.sequelize.close();
            this.logger.info('Database connection closed');
        }
        catch (error) {
            this.logger.error('Error closing database connection', error);
            throw error;
        }
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map