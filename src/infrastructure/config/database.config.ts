import { config } from 'dotenv';
import { Options } from 'sequelize';
config();
export const databaseConfig: Options = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'payroll_db',
  username: process.env.DB_USER || 'payroll_user',
  password: process.env.DB_PASSWORD || 'payroll_password',
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000', 10),
    idle: parseInt(process.env.DB_POOL_IDLE || '10000', 10),
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
};