"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
async function reset() {
    const db = database_1.Database.getInstance();
    await db.testConnection();
    await db.reset();
    await db.close();
    console.log('Base de datos reseteada');
}
reset();
//# sourceMappingURL=reset-database.js.map