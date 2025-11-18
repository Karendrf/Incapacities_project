import { Sequelize } from 'sequelize';
import { databaseConfig } from '../../config/database.config';
import { initModels, CompanyModel } from './models';
import { Logger } from '../../../shared/utils/logger';
export class Database {
  private static instance: Database;
  private sequelize: Sequelize;
  private readonly logger: Logger;
  private constructor() {
    this.logger = new Logger('Database');
    this.sequelize = new Sequelize(databaseConfig);
    this.setupEventListeners();
  }
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  private setupEventListeners(): void {
    this.logger.info('Configuración de base de datos cargada', {
      host: databaseConfig.host,
      database: databaseConfig.database,
      dialect: databaseConfig.dialect,
    });
  }
  public getSequelize(): Sequelize {
    return this.sequelize;
  }
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
  public async initialize(): Promise<void> {
    try {
      initModels(this.sequelize);
      this.logger.info('Modelos inicializados exitosamente');
      if (process.env.NODE_ENV === 'development') {
        await this.sequelize.sync({ 
          alter: true,
          force: false 
        });
        this.logger.info('Base de datos sincronizada exitosamente');
      } else {
        await this.sequelize.authenticate();
        this.logger.info('Base de datos verificada exitosamente');
      }
      await this.seedCompanies();
    } catch (error) {
      this.logger.error('Error inicializando base de datos', error as Error);
      throw error;
    }
  }
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
  public async close(): Promise<void> {
    try {
      await this.sequelize.close();
      this.logger.info('Conexión a base de datos cerrada');
    } catch (error) {
      this.logger.error('Error cerrando conexión a base de datos', error as Error);
      throw error;
    }
  }
  public async reset(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('No se puede resetear la base de datos en producción');
    }
    try {
      this.logger.warn('Reseteando base de datos...');
      await this.sequelize.sync({ force: true });
      await this.seedCompanies();
      this.logger.info('Base de datos reseteada exitosamente');
    } catch (error) {
      this.logger.error('Error reseteando base de datos', error as Error);
      throw error;
    }
  }
}