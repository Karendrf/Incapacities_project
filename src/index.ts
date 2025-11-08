import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { serverConfig } from './infrastructure/config/server.config';
import { Database } from './infrastructure/adapters/persistence/database';
import { PayrollRepository } from './infrastructure/adapters/persistence/PayrollRepository';
import { PayrollService } from './application/services/PayrollService';
import { PayrollController } from './infrastructure/adapters/http/controllers/PayrollController';
import { PayrollRoutes } from './infrastructure/adapters/http/routes/PayrollRoutes';
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
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        credentials: true,
      })
    );

    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (serverConfig.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Custom request logger
    this.app.use(RequestLogger.log);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    });

    // API info endpoint
    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
        version: '1.0.0',
        description: 'Microservicio de Nómina - Sistema de Incapacidades Médicas',
        orm: 'Sequelize',
        database: 'PostgreSQL',
        architecture: 'Hexagonal (Ports & Adapters)',
        endpoints: {
          health: 'GET /health',
          info: 'GET /',
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
        authentication: 'JWT Bearer Token',
        authorization: 'Solo administradores pueden acceder a los endpoints',
      });
    });

    // Initialize dependency injection
    const payrollRepository = new PayrollRepository();
    const payrollService = new PayrollService(payrollRepository);
    const payrollController = new PayrollController(payrollService);
    const payrollRoutes = new PayrollRoutes(payrollController);

    // Register payroll routes
    this.app.use('/api/payroll', payrollRoutes.getRouter());

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
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
      // Test database connection
      const dbConnected = await this.db.testConnection();
      if (!dbConnected) {
        throw new Error('No se pudo conectar a la base de datos');
      }

      // Initialize database (sync models and seed data)
      await this.db.initialize();

      // Start server
      this.app.listen(serverConfig.port, serverConfig.host, () => {
        this.logger.info(`Microservicio de Nómina escuchando en http://${serverConfig.host}:${serverConfig.port}`);
      });
    } catch (error) {
      this.logger.error('Error al iniciar el servidor', error as Error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Cerrando microservicio...');
    await this.db.close();
    this.logger.info('Microservicio cerrado correctamente');
    process.exit(0);
  }
}

// Initialize and start the microservice
const microservice = new PayrollMicroservice();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await microservice.shutdown();
});

process.on('SIGINT', async () => {
  await microservice.shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
microservice.start();