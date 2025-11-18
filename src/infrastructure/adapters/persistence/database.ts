import { Sequelize } from 'sequelize';
import { databaseConfig } from '../../config/database.config';
import { initModels, CompanyModel, AuthUserModel } from './models';
import { AuthService } from '../../../application/services/AuthService';
import { Logger } from '../../../shared/utils/logger';

/**
 * Gestor de base de datos
 * Implementa el patrón Singleton para manejar la conexión a PostgreSQL
 */
export class Database {
  private static instance: Database;
  private sequelize: Sequelize;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger('Database');
    this.sequelize = new Sequelize(databaseConfig);
    this.setupEventListeners();
  }

  //Obtiene la instancia única de Database
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  //Configura listeners para eventos de la base de datos
  private setupEventListeners(): void {
    this.logger.info('Configuración de base de datos cargada', {
      host: databaseConfig.host,
      database: databaseConfig.database,
      dialect: databaseConfig.dialect,
    });
  }

  //Obtiene la instancia de Sequelize
  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  //Prueba la conexión a la base de datos
  public async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      this.logger.info('Conexión a base de datos establecida exitosamente');
      return true;
    } catch (error) {
      this.logger.error('No se pudo conectar a la base de datos', error as Error);
      return false;
    }
  }

  //Inicializa la base de datos
  public async initialize(): Promise<void> {
    try {
      // Inicializar modelos
      initModels(this.sequelize);
      this.logger.info('Modelos inicializados exitosamente');
      
      // Solo sincronizar en desarrollo, en producción las tablas ya existen
      if (process.env.NODE_ENV === 'development') {
        await this.sequelize.sync({ 
          alter: true,
          force: false 
        });
        this.logger.info('Base de datos sincronizada exitosamente');
      } else {
        // En producción, solo verificar la conexión
        await this.sequelize.authenticate();
        this.logger.info('Base de datos verificada exitosamente');
      }
      
      await this.seedCompanies();
      // El seed de usuarios ya no es necesario ya que se manejan desde el microservicio de usuarios
      // await this.seedAuthUsers();
    } catch (error) {
      this.logger.error('Error inicializando base de datos', error as Error);
      throw error;
    }
  }
  //Empresas como datos quemados
  private async seedCompanies(): Promise<void> {
    try {
      const count = await CompanyModel.count();

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

        await CompanyModel.bulkCreate(companies);
        this.logger.info(`${companies.length} empresas creadas exitosamente`);
      } else {
        this.logger.info(`Ya existen ${count} empresas en la base de datos`);
      }
    } catch (error) {
      this.logger.error('Error creando empresas de prueba', error as Error);
      throw error;
    }
  }

  //Usuarios de autenticación con contraseñas hasheadas
  private async seedAuthUsers(): Promise<void> {
    try {
      const count = await AuthUserModel.count();
      if (count === 0) {
        this.logger.info('Creando usuarios de prueba...');
        // Hashear contraseñas de forma segura
        const adminPassword = await AuthService.hashPassword('admin123');
        const employeePassword = await AuthService.hashPassword('emp123');
        const users = [
          {
            username: 'admin',
            password: adminPassword,
            role: 'administrador' as const,
            document: '1234567890',
            name: 'Administrador Principal',
          },
          {
            username: 'empleado1',
            password: employeePassword,
            role: 'empleado' as const,
            document: '9876543210',
            name: 'Juan Pérez Empleado',
          },
          {
            username: 'empleado2',
            password: employeePassword,
            role: 'empleado' as const,
            document: '1122334455',
            name: 'María González Empleada',
          },
        ];

        await AuthUserModel.bulkCreate(users);
        this.logger.info(`${users.length} usuarios creados exitosamente`);
        // Mostrar credenciales solo en desarrollo
        if (process.env.NODE_ENV === 'development') {
          this.displayTestCredentials();
        }
      } else {
        this.logger.info(`Ya existen ${count} usuarios en la base de datos`);
      }
    } catch (error) {
      this.logger.error('Error creando usuarios de prueba', error as Error);
      throw error;
    }
  }

  //Muestra las credenciales de prueba en consola
  private displayTestCredentials(): void {
    this.logger.info('═'.repeat(60));
    this.logger.info('USUARIOS DE PRUEBA CREADOS (SOLO DESARROLLO)');
    this.logger.info('═'.repeat(60));
    this.logger.info('ADMINISTRADOR:');
    this.logger.info('  Username: admin');
    this.logger.info('  Password: admin123');
    this.logger.info('  Role: administrador');
    this.logger.info('  Document: 1234567890');
    this.logger.info('');
    this.logger.info('EMPLEADO 1:');
    this.logger.info('  Username: empleado1');
    this.logger.info('  Password: emp123');
    this.logger.info('  Role: empleado');
    this.logger.info('  Document: 9876543210');
    this.logger.info('');
    this.logger.info('EMPLEADO 2:');
    this.logger.info('  Username: empleado2');
    this.logger.info('  Password: emp123');
    this.logger.info('  Role: empleado');
    this.logger.info('  Document: 1122334455');
    this.logger.info('═'.repeat(60));
    this.logger.info('IMPORTANTE: Cambiar estas contraseñas en producción');
    this.logger.info('═'.repeat(60));
  }

  //Cierra la conexión a la base de datos
  public async close(): Promise<void> {
    try {
      await this.sequelize.close();
      this.logger.info('Conexión a base de datos cerrada');
    } catch (error) {
      this.logger.error('Error cerrando conexión a base de datos', error as Error);
      throw error;
    }
  }

  //Elimina todas las tablas y recrea el esquema
  public async reset(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('No se puede resetear la base de datos en producción');
    }

    try {
      this.logger.warn('Reseteando base de datos...');
      await this.sequelize.sync({ force: true });
      await this.seedCompanies();
      await this.seedAuthUsers();
      this.logger.info('Base de datos reseteada exitosamente');
    } catch (error) {
      this.logger.error('Error reseteando base de datos', error as Error);
      throw error;
    }
  }
}