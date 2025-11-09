import { Sequelize } from 'sequelize';
import { initCompanyModel, CompanyModel } from './CompanyModel';
import { initPayrollModel, PayrollModel, associatePayrollModel } from './PayrollModel';
import { initAuthUserModel, AuthUserModel } from './AuthUserModel';

export const initModels = (sequelize: Sequelize): void => {
  // Initialize models
  initCompanyModel(sequelize);
  initPayrollModel(sequelize);
  initAuthUserModel(sequelize);

  // Setup associations
  associatePayrollModel();
};

export { CompanyModel, PayrollModel, AuthUserModel };