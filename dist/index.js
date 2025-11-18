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
const CompaniesRoutes_1 = require("./infrastructure/adapters/http/routes/CompaniesRoutes");
const authMiddleware_1 = require("./infrastructure/adapters/http/middlewares/authMiddleware");
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
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                },
            },
        }));
        this.app.use((0, cors_1.default)({
            origin: this.getAllowedOrigins(),
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        if (server_config_1.serverConfig.nodeEnv === 'development') {
            this.app.use((0, morgan_1.default)('dev'));
        }
        else {
            this.app.use((0, morgan_1.default)('combined'));
        }
        this.app.use(requestLogger_1.RequestLogger.log);
    }
    getAllowedOrigins() {
        const origins = process.env.ALLOWED_ORIGINS;
        if (!origins || origins === '*') {
            return '*';
        }
        return origins.split(',').map(origin => origin.trim());
    }
    initializeRoutes() {
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                success: true,
                service: server_config_1.serverConfig.serviceName,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                version: '2.0.0',
            });
        });
        this.app.get('/', (_req, res) => {
            res.status(200).json({
                success: true,
                service: server_config_1.serverConfig.serviceName,
                version: '2.0.0',
                description: 'Microservicio de Nómina - Sistema de Gestión de Recursos Humanos',
                documentation: '/api/docs',
                authentication: {
                    type: 'JWT Bearer Token',
                    info: 'Autenticación manejada por UsersService',
                },
                endpoints: {
                    payrolls: {
                        create: 'POST /api/payrolls (requiere admin)',
                        update: 'PUT /api/payrolls/:id (requiere admin)',
                        getById: 'GET /api/payrolls/:id (requiere admin o propietario)',
                        getAll: 'GET /api/payrolls (requiere admin)',
                        getByDocument: 'GET /api/payrolls/document/:document (requiere admin o propietario)',
                        getActiveByDocument: 'GET /api/payrolls/document/:document/active (requiere admin o propietario)',
                        delete: 'DELETE /api/payrolls/:id (requiere admin)',
                    },
                    companies: {
                        getAll: 'GET /api/companies (requiere autenticación)',
                    },
                },
            });
        });
        const payrollRepository = new PayrollRepository_1.PayrollRepository();
        const payrollService = new PayrollService_1.PayrollService(payrollRepository);
        const payrollController = new PayrollController_1.PayrollController(payrollService);
        authMiddleware_1.AuthMiddleware.configure(payrollRepository);
        const payrollRoutes = new PayrollRoutes_1.PayrollRoutes(payrollController);
        this.app.use('/api/payrolls', payrollRoutes.getRouter());
        const companyRoutes = new CompaniesRoutes_1.CompanyRoutes(payrollController);
        this.app.use('/api/companies', companyRoutes.getRouter());
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: {
                    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
                    statusCode: 404,
                    suggestion: 'Consulte la documentación en GET / para ver las rutas disponibles',
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
                this.logger.info('═'.repeat(60));
                this.logger.info(`Microservicio de Nómina`);
                this.logger.info('═'.repeat(60));
                this.logger.info(`Servidor iniciado en http://${server_config_1.serverConfig.host}:${server_config_1.serverConfig.port}`);
                this.logger.info(`Base de datos: Conectada`);
                this.logger.info('═'.repeat(60));
            });
        }
        catch (error) {
            this.logger.error('Error al iniciar el servidor', error);
            process.exit(1);
        }
    }
    async shutdown() {
        this.logger.info('Cerrando microservicio de forma segura...');
        try {
            await this.db.close();
            this.logger.info('Base de datos cerrada correctamente');
            process.exit(0);
        }
        catch (error) {
            this.logger.error('Error durante el cierre', error);
            process.exit(1);
        }
    }
}
const microservice = new PayrollMicroservice();
process.on('SIGTERM', async () => {
    console.log('\nSeñal SIGTERM recibida');
    await microservice.shutdown();
});
process.on('SIGINT', async () => {
    console.log('\nSeñal SIGINT recibida');
    await microservice.shutdown();
});
process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rechazada sin manejar:', promise);
    console.error('Razón:', reason);
    process.exit(1);
});
microservice.start();
//# sourceMappingURL=index.js.map