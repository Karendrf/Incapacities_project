import { PayrollStatus } from '../../domain/enums/PayrollStatus';

/**
 * DTO para la creación de una nómina
 */
export interface CreatePayrollDto {
  /**Documento del usuario asociado a la nómina*/
  userDocument: string;
  /**ID de la empresa relacionada*/
  companyId: number;
  /**Cargo del empleado (opcional)*/
  position?: string;
  /**Estado actual de la nómina*/
  status: PayrollStatus;
}
