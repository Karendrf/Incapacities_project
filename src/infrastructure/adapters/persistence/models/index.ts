import { Sequelize } from 'sequelize';
import { initCompanyModel, CompanyModel } from './CompanyModel';
import { initPayrollModel, PayrollModel, associatePayrollModel } from './PayrollModel';
import { initAuthUserModel, AuthUserModel } from './AuthUserModel';

/**
 * Inicializa todos los modelos de la base de datos
 * Esta función centraliza la inicialización de todos los modelos del sistema
 * y establece las relaciones (asociaciones) entre ellos. Debe ejecutarse
 * al inicio de la aplicación, después de crear la conexión con Sequelize
 */
export const initModels = (sequelize: Sequelize): void => {
  //Inicializa el modelo de empresas
  initCompanyModel(sequelize);
  //Inicializa el modelo de nóminas
  initPayrollModel(sequelize);
  //Inicializa el modelo de usuarios de autenticación
  initAuthUserModel(sequelize);
  //Configura las relaciones entre modelos (llaves foráneas, asociaciones)
  associatePayrollModel();
};

//Exportación de modelos
export { CompanyModel, PayrollModel, AuthUserModel };