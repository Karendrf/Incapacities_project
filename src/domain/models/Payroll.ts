import { PayrollStatus } from '../enums/PayrollStatus';

export interface Payroll {
  id: number;
  userDocument: string;
  companyId: number;
  position?: string;
  status: PayrollStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollWithDetails extends Payroll {
  company?: {
    id: number;
    name: string;
    nit: string;
    address?: string;
    phone?: string;
  };
}