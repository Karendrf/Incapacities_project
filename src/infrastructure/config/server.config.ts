import { config } from 'dotenv';

//Carga variables de entorno
config();

//Configuración del servidor
export const serverConfig = {
  //Puerto del servidor
  port: parseInt(process.env.PORT || '3002', 10),
  //Host del servidor
  host: process.env.HOST || '0.0.0.0',
  //Entorno de ejecución
  nodeEnv: process.env.NODE_ENV || 'development',
  //Configuración de la base de datos
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  serviceName: process.env.SERVICE_NAME || 'payroll-service',
  logLevel: process.env.LOG_LEVEL || 'info',
};