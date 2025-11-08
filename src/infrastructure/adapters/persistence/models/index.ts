import { Sequelize } from 'sequelize';
import { initCompanyModel, CompanyModel } from './CompanyModel';
import { initPayrollModel, PayrollModel, associatePayrollModel } from './PayrollModel';

export const initModels = (sequelize: Sequelize): void => {
  // Initialize models
  initCompanyModel(sequelize);
  initPayrollModel(sequelize);

  // Setup associations
  associatePayrollModel();
};

export { CompanyModel, PayrollModel };