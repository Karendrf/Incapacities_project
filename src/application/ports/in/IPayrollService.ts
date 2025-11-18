import { Payroll, PayrollWithDetails } from '../../../domain/models/Payroll'; 
import { Company } from '../../../domain/models/Company';
import { CreatePayrollDto } from '../../dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../../dto/UpdatePayrollDto';

/**
 * Interfaz del servicio de nómina
 * Define las operaciones principales para gestionar las nóminas
 */
export interface IPayrollService {
  /**Crea una nueva nómina*/
  createPayroll(payrollData: CreatePayrollDto): Promise<Payroll>;
  /**Actualiza una nómina existente según su ID*/
  updatePayroll(id: number, payrollData: UpdatePayrollDto): Promise<Payroll>;
  /*Obtiene una nómina por su ID (incluye detalles adicionales)*/
  getPayrollById(id: number): Promise<PayrollWithDetails>;
  /**Obtiene todas las nóminas registradas (con detalles)*/
  getAllPayrolls(): Promise<PayrollWithDetails[]>;
  /**Busca una nómina usando el documento del usuario*/
  getPayrollByUserDocument(userDocument: string): Promise<Payroll>;
  /**Obtiene la nómina activa del usuario según su documento*/
  getActivePayrollByUserDocument(userDocument: string): Promise<Payroll>;
  /**Obtiene todas las empresas disponibles*/
  getAllCompanies(): Promise<Company[]>;
  /**Elimina una nómina por su ID*/
  deletePayroll(id: number): Promise<void>;
}
