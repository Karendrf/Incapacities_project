import { PayrollStatus } from '../../domain/enums/PayrollStatus';
export interface UpdatePayrollDto {
  companyId?: number;
  position?: string;
  status?: PayrollStatus;
}
