import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { serverConfig } from './infrastructure/config/server.config';
import { Database } from './infrastructure/adapters/persistence/database';
import { PayrollRepository } from './infrastructure/adapters/persistence/PayrollRepository';
import { PayrollService } from './application/services/PayrollService';
import { PayrollController } from './infrastructure/adapters/http/controllers/PayrollController';
import { PayrollRoutes } from './infrastructure/adapters/http/routes/PayrollRoutes';
import { AuthRoutes } from './infrastructure/adapters/http/routes/AuthRoutes';
import { ErrorHandler } from './infrastructure/adapters/http/middlewares/errorHandler';
import { RequestLogger } from './infrastructure/adapters/http/middlewares/requestLogger';
import { Logger } from './shared/utils/logger';

class PayrollMicroservice {
  private app: Application;
  private readonly logger: Logger;
  private db: Database;

  constructor() {
    this.app = express();
    this.logger = new Logger('PayrollMicroservice');
    this.db = Database.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true,
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    if (serverConfig.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    this.app.use(RequestLogger.log);
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    });

    // API info
    this.app.get('/', (_req, res) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
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
    const authRoutes = new AuthRoutes();
    this.app.use('/api/auth', authRoutes.getRouter());

    // PAYROLL ROUTES
    const payrollRepository = new PayrollRepository();
    const payrollService = new PayrollService(payrollRepository);
    const payrollController = new PayrollController(payrollService);
    const payrollRoutes = new PayrollRoutes(payrollController);
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

  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  public async start(): Promise<void> {
    try {
      const dbConnected = await this.db.testConnection();
      if (!dbConnected) {
        throw new Error('No se pudo conectar a la base de datos');
      }

      await this.db.initialize();

      this.app.listen(serverConfig.port, serverConfig.host, () => {
        this.logger.info(`Microservicio de Nómina iniciado en http://${serverConfig.host}:${serverConfig.port}`);
      });
    } catch (error) {
      this.logger.error('Error al iniciar el servidor', error as Error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Cerrando microservicio...');
    await this.db.close();
    process.exit(0);
  }
}

const microservice = new PayrollMicroservice();

process.on('SIGTERM', async () => await microservice.shutdown());
process.on('SIGINT', async () => await microservice.shutdown());
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

microservice.start();