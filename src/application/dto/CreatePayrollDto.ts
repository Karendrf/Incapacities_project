import { PayrollStatus } from '../../domain/enums/PayrollStatus';
export interface CreatePayrollDto {
  userId: number;
  companyId: number;
  status: PayrollStatus;
}
