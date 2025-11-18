import { IPayrollService } from '../ports/in/IPayrollService';
import { IPayrollRepository } from '../ports/out/IPayrollRepository';
import { Payroll, PayrollWithDetails } from '../../domain/models/Payroll';
import { Company } from '../../domain/models/Company';
import { CreatePayrollDto } from '../dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../dto/UpdatePayrollDto';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ValidationError } from '../../shared/errors/ValidationError';
import { Validator } from '../../shared/utils/validator';
import { Logger } from '../../shared/utils/logger';

/**
 * Servicio encargado de manejar la lógica de negocio de las nóminas.
 */
export class PayrollService implements IPayrollService {
  private readonly logger: Logger;
  constructor(private readonly payrollRepository: IPayrollRepository) {
    this.logger = new Logger('PayrollService');
  }

  /**
   * Crea una nueva nómina
   */
  public async createPayroll(payrollData: CreatePayrollDto): Promise<Payroll> {
    this.logger.info('Creating new payroll', { userDocument: payrollData.userDocument });
    // Validar campos requeridos
    Validator.validateRequiredFields(payrollData, ['userDocument', 'companyId', 'status']);
    // Validar documento
    if (!Validator.isValidDocument(payrollData.userDocument)) {
      throw new ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
    }
    // Validar existencia de la empresa
    const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
    if (!company) {
      throw new NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
    }
    // Validar estado
    if (!Validator.isValidStatus(payrollData.status)) {
      throw new ValidationError('Estado de nómina inválido. Use: activo o retirado');
    }
    // Validar si ya existe nómina para ese documento
    const existingPayroll = await this.payrollRepository.findByUserDocument(payrollData.userDocument);
    if (existingPayroll) {
      throw new ValidationError(
        `El usuario con documento ${payrollData.userDocument} ya tiene una nómina registrada`
      );
    }
    // Normalizar texto opcional
    if (payrollData.position) {
      payrollData.position = Validator.sanitizeString(payrollData.position);
    }
    try {
      const payroll = await this.payrollRepository.create(payrollData);
      this.logger.info('Payroll created successfully', { 
        id: payroll.id, 
        userDocument: payroll.userDocument 
      });
      return payroll;
    } catch (error) {
      this.logger.error('Error creating payroll', error as Error);
      throw error;
    }
  }

  /**
   * Actualiza una nómina existente
   */
  public async updatePayroll(id: number, payrollData: UpdatePayrollDto): Promise<Payroll> {
    this.logger.info('Updating payroll', { id });
    // Validar ID
    if (!Validator.isPositiveInteger(id)) {
      throw new ValidationError('ID de nómina inválido');
    }
    // Validar existencia de la nómina
    const existingPayroll = await this.payrollRepository.findById(id);
    if (!existingPayroll) {
      throw new NotFoundError(`Nómina con ID ${id} no encontrada`);
    }
    // Validar empresa si viene en la actualización
    if (payrollData.companyId) {
      const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
      if (!company) {
        throw new NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
      }
    }
    // Validar estado si viene en la actualización
    if (payrollData.status && !Validator.isValidStatus(payrollData.status)) {
      throw new ValidationError('Estado de nómina inválido. Use: activo o retirado');
    }
    // Normalizar texto opcional
    if (payrollData.position) {
      payrollData.position = Validator.sanitizeString(payrollData.position);
    }
    try {
      const updatedPayroll = await this.payrollRepository.update(id, payrollData);
      this.logger.info('Payroll updated successfully', { id });
      return updatedPayroll;
    } catch (error) {
      this.logger.error('Error updating payroll', error as Error);
      throw error;
    }
  }

  /**
   * Obtiene una nómina por su ID
   */
  public async getPayrollById(id: number): Promise<PayrollWithDetails> {
    this.logger.info('Getting payroll by ID', { id });
    if (!Validator.isPositiveInteger(id)) {
      throw new ValidationError('ID de nómina inválido');
    }
    const payroll = await this.payrollRepository.findById(id);
    if (!payroll) {
      throw new NotFoundError(`Nómina con ID ${id} no encontrada`);
    }
    return payroll;
  }

  /**
   * Obtiene todas las nóminas
   */
  public async getAllPayrolls(): Promise<PayrollWithDetails[]> {
    this.logger.info('Getting all payrolls');
    return await this.payrollRepository.findAll();
  }

  /**
   * Busca una nómina por documento del usuario
   */
  public async getPayrollByUserDocument(userDocument: string): Promise<Payroll> {
    this.logger.info('Getting payroll by user document', { userDocument });
    if (!Validator.isValidDocument(userDocument)) {
      throw new ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
    }
    const payroll = await this.payrollRepository.findByUserDocument(userDocument);
    if (!payroll) {
      throw new NotFoundError(`No se encontró nómina para el documento ${userDocument}`);
    }
    return payroll;
  }

  /**
   * Busca la nómina activa de un usuario
   */
  public async getActivePayrollByUserDocument(userDocument: string): Promise<Payroll> {
    this.logger.info('Getting active payroll by user document', { userDocument });
    if (!Validator.isValidDocument(userDocument)) {
      throw new ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
    }
    const payroll = await this.payrollRepository.findActiveByUserDocument(userDocument);
    if (!payroll) {
      throw new NotFoundError(
        `No se encontró nómina activa para el documento ${userDocument}`
      );
    }
    return payroll;
  }

  /**
   * Obtiene todas las empresas registradas
   */
  public async getAllCompanies(): Promise<Company[]> {
    this.logger.info('Getting all companies');
    return await this.payrollRepository.getAllCompanies();
  }

  /**
   * Elimina una nómina
   */
  public async deletePayroll(id: number): Promise<void> {
    this.logger.info('Deleting payroll', { id });
    if (!Validator.isPositiveInteger(id)) {
      throw new ValidationError('ID de nómina inválido');
    }
    const exists = await this.payrollRepository.findById(id);
    if (!exists) {
      throw new NotFoundError(`Nómina con ID ${id} no encontrada`);
    }
    const deleted = await this.payrollRepository.delete(id);
    if (!deleted) {
      throw new Error('Error al eliminar la nómina');
    }
    this.logger.info('Payroll deleted successfully', { id });
  }
}
