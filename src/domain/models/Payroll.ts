import { PayrollStatus } from '../enums/PayrollStatus';

/**
 * Representa una nómina básica dentro del sistema.
 * Contiene la información principal del registro de nómina.
 */
export interface Payroll {
  /** ID único de la nómina */
  id: number;
  /** Documento del usuario al que pertenece la nómina */
  userDocument: string;
  /** ID de la empresa asociada */
  companyId: number;
  /** Cargo del empleado dentro de la empresa (opcional) */
  position?: string;
  /** Estado de la nómina (activo o retirado) */
  status: PayrollStatus;
  /** Fecha de creación del registro */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
}

/**
 * Extiende la información de una nómina incluyendo los datos de la empresa.
 * Se usa cuando se necesita mostrar detalles adicionales.
 */
export interface PayrollWithDetails extends Payroll {
  /** Información de la empresa asociada (opcional) */
  company?: {
    /** ID de la empresa */
    id: number;
    /** Nombre de la empresa */
    name: string;
    /** NIT de la empresa */
    nit: string;
    /** Dirección de la empresa (opcional) */
    address?: string;
    /** Teléfono de la empresa (opcional) */
    phone?: string;
  };
}
