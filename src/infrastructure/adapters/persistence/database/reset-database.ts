import { Database } from '../database';
async function reset() {
  const db = Database.getInstance();
  await db.testConnection();
  await db.reset();
  await db.close();
  console.log('Base de datos reseteada');
}
reset();
