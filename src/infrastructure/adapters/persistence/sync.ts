import { Database } from './database';
import { Logger } from '../../../shared/utils/logger';

const logger = new Logger('DatabaseSync');

//Sincroniza la base de datos con los modelos definidos
async function syncDatabase() {
  try {
    logger.info('Iniciando la sincronización de la base de datos...');
    //Obtiene la instancia singleton de la base de datos
    const db = Database.getInstance();
    //Verifica que la conexión a la base de datos sea exitosa
    const connected = await db.testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar a la base de datos');
    }
    //Inicializa la base de datos, creando tablas y relaciones según los modelos
    await db.initialize(); 
    logger.info('Base de datos sincronizada correctamente');
    process.exit(0);
  } catch (error) {
    logger.error('La sincronización con la base de datos falló', error as Error);
    process.exit(1);
  }
}
// Ejecuta la sincronización de la base de datos
syncDatabase();