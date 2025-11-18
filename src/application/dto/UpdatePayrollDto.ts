import { PayrollStatus } from '../../domain/enums/PayrollStatus';

/**
 * DTO para actualizar una nómina. Todos los campos son opcionales
 */
export interface UpdatePayrollDto {
  /** ID de la empresa asociada*/
  companyId?: number;
  /** Cargo del empleado*/
  position?: string;
  /** Estado de la nómina*/
  status?: PayrollStatus;
}
