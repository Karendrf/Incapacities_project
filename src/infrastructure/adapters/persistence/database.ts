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
    // No direct pool events in Sequelize, but we can log connection attempts
    this.logger.info('Database configuration loaded');
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      this.logger.info('Database connection has been established successfully');
      return true;
    } catch (error) {
      this.logger.error('Unable to connect to the database', error as Error);
      return false;
    }
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize models
      initModels(this.sequelize);
      this.logger.info('Models initialized successfully');

      // Sync database (create tables if they don\'t exist)
      await this.sequelize.sync({ alter: false });
      this.logger.info('Database synchronized successfully');

      // Seed companies if needed
      await this.seedCompanies();
    } catch (error) {
      this.logger.error('Error initializing database', error as Error);
      throw error;
    }
  }

  private async seedCompanies(): Promise<void> {
    try {
      const count = await CompanyModel.count();
      
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

        await CompanyModel.bulkCreate(companies);
        this.logger.info(`${companies.length} companies seeded successfully`);
      } else {
        this.logger.info(`${count} companies already exist in database`);
      }
    } catch (error) {
      this.logger.error('Error seeding companies', error as Error);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.sequelize.close();
      this.logger.info('Database connection closed');
    } catch (error) {
      this.logger.error('Error closing database connection', error as Error);
      throw error;
    }
  }

  // Transaction helper
  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const t = await this.sequelize.transaction();
    try {
      const result = await callback();
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      this.logger.error('Transaction rolled back', error as Error);
      throw error;
    }
  }
}