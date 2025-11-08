import { Database } from './database';
import { Logger } from '../../../shared/utils/logger';

const logger = new Logger('DatabaseSync');

async function syncDatabase() {
  try {
    logger.info('Starting database synchronization...');
    
    const db = Database.getInstance();
    //const sequelize = db.getSequelize();
    
    // Test connection
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('Could not connect to database');
    }

    // Initialize models and sync
    await db.initialize();
    
    logger.info('Database synchronization completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database synchronization failed', error as Error);
    process.exit(1);
  }
}

syncDatabase();