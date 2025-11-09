"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const server_config_1 = require("./infrastructure/config/server.config");
const database_1 = require("./infrastructure/adapters/persistence/database");
const PayrollRepository_1 = require("./infrastructure/adapters/persistence/PayrollRepository");
const PayrollService_1 = require("./application/services/PayrollService");
const PayrollController_1 = require("./infrastructure/adapters/http/controllers/PayrollController");
const PayrollRoutes_1 = require("./infrastructure/adapters/http/routes/PayrollRoutes");
const AuthRoutes_1 = require("./infrastructure/adapters/http/routes/AuthRoutes");
const errorHandler_1 = require("./infrastructure/adapters/http/middlewares/errorHandler");
const requestLogger_1 = require("./infrastructure/adapters/http/middlewares/requestLogger");
const logger_1 = require("./shared/utils/logger");
class PayrollMicroservice {
    constructor() {
        this.app = (0, express_1.default)();
        this.logger = new logger_1.Logger('PayrollMicroservice');
        this.db = database_1.Database.getInstance();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            credentials: true,
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        if (server_config_1.serverConfig.nodeEnv === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        else {
            this.app.use((0, morgan_1.default)('combined'));
        }
        this.app.use(requestLogger_1.RequestLogger.log);
    }
    initializeRoutes() {
        // Health check
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                success: true,
                service: server_config_1.serverConfig.serviceName,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
            });
        });
        // API info
        this.app.get('/', (_req, res) => {
            res.status(200).json({
                success: true,
                service: server_config_1.serverConfig.serviceName,
                version: '1.0.0',
                description: 'Microservicio de Nómina - Sistema de Incapacidades Médicas',
                authentication: 'JWT Bearer Token',
                testUsers: {
                    admin: {
                        username: 'admin',
                        password: 'admin123',
                        role: 'administrador',
                    },
                    employee: {
                        username: 'empleado1',
                        password: 'emp123',
                        role: 'empleado',
                    },
                },
                endpoints: {
                    auth: {
                        login: 'POST /api/auth/login',
                        me: 'GET /api/auth/me',
                    },
                    payrolls: {
                        create: 'POST /api/payroll/createPayroll',
                        update: 'PUT /api/payroll/updatePayroll/:id',
                        getById: 'GET /api/payroll/getPayrollById/:id',
                        getAll: 'GET /api/payroll/getAllPayrolls',
                        getByDocument: 'GET /api/payroll/getPayrollByDocument/:document',
                        getActiveByDocument: 'GET /api/payroll/getActivePayrollByDocument/:document',
                        delete: 'DELETE /api/payroll/deletePayroll/:id',
                        companies: 'GET /api/payroll/companies',
                    },
                },
            });
        });
        // AUTH ROUTES (NUEVO)
        const authRoutes = new AuthRoutes_1.AuthRoutes();
        this.app.use('/api/auth', authRoutes.getRouter());
        // PAYROLL ROUTES
        const payrollRepository = new PayrollRepository_1.PayrollRepository();
        const payrollService = new PayrollService_1.PayrollService(payrollRepository);
        const payrollController = new PayrollController_1.PayrollController(payrollService);
        const payrollRoutes = new PayrollRoutes_1.PayrollRoutes(payrollController);
        this.app.use('/api/payroll', payrollRoutes.getRouter());
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
                    statusCode: 404,
                },
            });
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.ErrorHandler.handle);
    }
    async start() {
        try {
            const dbConnected = await this.db.testConnection();
            if (!dbConnected) {
                throw new Error('No se pudo conectar a la base de datos');
            }
            await this.db.initialize();
            this.app.listen(server_config_1.serverConfig.port, server_config_1.serverConfig.host, () => {
                this.logger.info(`Microservicio de Nómina iniciado en http://${server_config_1.serverConfig.host}:${server_config_1.serverConfig.port}`);
            });
        }
        catch (error) {
            this.logger.error('Error al iniciar el servidor', error);
            process.exit(1);
        }
    }
    async shutdown() {
        this.logger.info('Cerrando microservicio...');
        await this.db.close();
        process.exit(0);
    }
}
const microservice = new PayrollMicroservice();
process.on('SIGTERM', async () => await microservice.shutdown());
process.on('SIGINT', async () => await microservice.shutdown());
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
microservice.start();
//# sourceMappingURL=index.js.map