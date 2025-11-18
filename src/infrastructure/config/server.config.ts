import { config } from 'dotenv';
config();
export const serverConfig = {
  port: parseInt(process.env.PORT || '3002', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  serviceName: process.env.SERVICE_NAME || 'payroll-service',
  logLevel: process.env.LOG_LEVEL || 'info',
};