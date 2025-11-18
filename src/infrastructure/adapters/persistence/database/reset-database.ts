//Script para reiniciar la base de datos
import { Database } from '../database';

async function reset() {
  // Obtiene la instancia única de conexión a la base de datos
  const db = Database.getInstance();
  // 1. Verifica que la conexión con la base de datos funciona correctamente
  await db.testConnection();
  // 2. Ejecuta el reseteo completo de las tablas
  await db.reset();
  // 3. Cierra la conexión para evitar procesos colgados
  await db.close();
  console.log('Base de datos reseteada');
}
// Llama a la función principal
reset();
