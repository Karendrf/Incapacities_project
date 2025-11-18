import { config } from 'dotenv';
import { Options } from 'sequelize';

//Carga variables de entorno
config();

//Configuración de conexión a la base de datos PostgreSQL
export const databaseConfig: Options = {
  //Dirección del servidor de base de datos
  host: process.env.DB_HOST || 'localhost',
  //Puerto de conexión
  port: parseInt(process.env.DB_PORT || '5432', 10),
  //Nombre de la base de datos
  database: process.env.DB_NAME || 'payroll_db',
  //Usuario de la base de datos
  username: process.env.DB_USER || 'payroll_user',
  //Contraseña del usuario de la base de datos
  password: process.env.DB_PASSWORD || 'payroll_password',
  //Tipo de base de datos
  dialect: 'postgres',
  //Configuraciones adicionales
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