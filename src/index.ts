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
import { CompanyRoutes } from './infrastructure/adapters/http/routes/CompaniesRoutes';
import { AuthRoutes } from './infrastructure/adapters/http/routes/AuthRoutes';
import { AuthMiddleware } from './infrastructure/adapters/http/middlewares/authMiddleware';
import { ErrorHandler } from './infrastructure/adapters/http/middlewares/errorHandler';
import { RequestLogger } from './infrastructure/adapters/http/middlewares/requestLogger';
import { Logger } from './shared/utils/logger';

/**
 * Clase principal del microservicio de nómina
 * Configura Express, middlewares, rutas y conexión a base de datos
 */
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

  //Inicializa los middlewares de Express
  private initializeMiddlewares(): void {
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }));
    this.app.use(
      cors({
        origin: this.getAllowedOrigins(),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    if (serverConfig.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
    this.app.use(RequestLogger.log);
  }

  //Obtiene los orígenes permitidos para CORS
  private getAllowedOrigins(): string | string[] {
    const origins = process.env.ALLOWED_ORIGINS;
    if (!origins || origins === '*') {
      return '*';
    }
    return origins.split(',').map(origin => origin.trim());
  }

  //Inicializa todas las rutas de la aplicación sin autenticación
  private initializeRoutes(): void {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        version: '2.0.0',
      });
    });
    // Información de la API
    this.app.get('/', (_req, res) => {
      res.status(200).json({
        success: true,
        service: serverConfig.serviceName,
        version: '2.0.0',
        description: 'Microservicio de Nómina - Sistema de Gestión de Recursos Humanos',
        documentation: '/api/docs',
        authentication: {
          type: 'JWT Bearer Token',
          endpoint: '/api/auth/login',
          testUsers: this.getTestUsersInfo(),
        },
        endpoints: {
          auth: {
            login: 'POST /api/auth/login',
            me: 'GET /api/auth/me (requiere autenticación)',
          },
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

    // Inicializa repositorio y servicio
    const payrollRepository = new PayrollRepository();
    const payrollService = new PayrollService(payrollRepository);
    const payrollController = new PayrollController(payrollService);
    // Configura el repositorio en AuthMiddleware para validación de ownership
    AuthMiddleware.configure(payrollRepository);
    // Rutas de autenticación
    const authRoutes = new AuthRoutes();
    this.app.use('/api/auth', authRoutes.getRouter());
    // Rutas de nómina 
    const payrollRoutes = new PayrollRoutes(payrollController);
    this.app.use('/api/payrolls', payrollRoutes.getRouter());
    // Rutas de empresas 
    const companyRoutes = new CompanyRoutes(payrollController);
    this.app.use('/api/companies', companyRoutes.getRouter());
    // Manejo de rutas no encontradas
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

  //Obtiene información de usuarios de prueba
  private getTestUsersInfo(): any {
    if (serverConfig.nodeEnv === 'development') {
      return {
        admin: {
          username: 'admin',
          password: 'admin123',
          role: 'administrador',
          document: '1234567890',
        },
        employee1: {
          username: 'empleado1',
          password: 'emp123',
          role: 'empleado',
          document: '9876543210',
        },
        employee2: {
          username: 'empleado2',
          password: 'emp123',
          role: 'empleado',
          document: '1122334455',
        },
      };
    }
    return 'Disponible solo en modo desarrollo';
  }

  //Inicializa el manejo global de errores
  private initializeErrorHandling(): void {
    this.app.use(ErrorHandler.handle);
  }

  //Inicia el servidor
  public async start(): Promise<void> {
    try {
      // Verifica la conexión a la base de datos
      const dbConnected = await this.db.testConnection();
      if (!dbConnected) {
        throw new Error('No se pudo conectar a la base de datos');
      }
      // Inicializa la base de datos
      await this.db.initialize();
      // Inicia el servidor HTTP
      this.app.listen(serverConfig.port, serverConfig.host, () => {
        this.logger.info('═'.repeat(60));
        this.logger.info(`Microservicio de Nómina`);
        this.logger.info('═'.repeat(60));
        this.logger.info(`Servidor iniciado en http://${serverConfig.host}:${serverConfig.port}`);
        this.logger.info(`Base de datos: Conectada`);
        this.logger.info('═'.repeat(60));
      });
    } catch (error) {
      this.logger.error('Error al iniciar el servidor', error as Error);
      process.exit(1);
    }
  }

  //Apaga el servidor de forma segura
  public async shutdown(): Promise<void> {
    this.logger.info('Cerrando microservicio de forma segura...');
    
    try {
      await this.db.close();
      this.logger.info('Base de datos cerrada correctamente');
      process.exit(0);
    } catch (error) {
      this.logger.error('Error durante el cierre', error as Error);
      process.exit(1);
    }
  }
}

//Inicializa el microservicio
const microservice = new PayrollMicroservice();
// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('\nSeñal SIGTERM recibida');
  await microservice.shutdown();
});

process.on('SIGINT', async () => {
  console.log('\nSeñal SIGINT recibida');
  await microservice.shutdown();
});
// Manejo de excepciones no capturadas
process.on('uncaughtException', (error: Error) => {
  console.error('Excepción no capturada:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Promise rechazada sin manejar:', promise);
  console.error('Razón:', reason);
  process.exit(1);
});

// Inicia el servidor
microservice.start();