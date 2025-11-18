import { Sequelize } from 'sequelize';
import { initCompanyModel, CompanyModel } from './CompanyModel';
import { initPayrollModel, PayrollModel, associatePayrollModel } from './PayrollModel';
export const initModels = (sequelize: Sequelize): void => {
  initCompanyModel(sequelize);
  initPayrollModel(sequelize);
  associatePayrollModel();
};
export { CompanyModel, PayrollModel };