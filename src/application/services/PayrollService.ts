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
export class PayrollService implements IPayrollService {
  private readonly logger: Logger;
  constructor(private readonly payrollRepository: IPayrollRepository) {
    this.logger = new Logger('PayrollService');
  }
  public async createPayroll(payrollData: CreatePayrollDto): Promise<Payroll> {
    this.logger.info('Creating new payroll', { userId: payrollData.userId });
    Validator.validateRequiredFields(payrollData, ['userId', 'companyId', 'status']);
    
    const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
    if (!company) {
      throw new NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
    }
    if (!Validator.isValidStatus(payrollData.status)) {
      throw new ValidationError('Estado de nómina inválido. Use: activo o retirado');
    }
    const existingPayroll = await this.payrollRepository.findByUserId(payrollData.userId);
    if (existingPayroll) {
      throw new ValidationError(
        `El usuario con ID ${payrollData.userId} ya tiene una nómina registrada`
      );
    }
    try {
      const payroll = await this.payrollRepository.create(payrollData);
      this.logger.info('Payroll created successfully', { 
        id: payroll.id, 
        userId: payroll.userId 
      });
      return payroll;
    } catch (error) {
      this.logger.error('Error creating payroll', error as Error);
      throw error;
    }
  }
  public async updatePayroll(id: number, payrollData: UpdatePayrollDto): Promise<Payroll> {
    this.logger.info('Updating payroll', { id });
    if (!Validator.isPositiveInteger(id)) {
      throw new ValidationError('ID de nómina inválido');
    }
    const existingPayroll = await this.payrollRepository.findById(id);
    if (!existingPayroll) {
      throw new NotFoundError(`Nómina con ID ${id} no encontrada`);
    }
    if (payrollData.companyId) {
      const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
      if (!company) {
        throw new NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
      }
    }
    if (payrollData.status && !Validator.isValidStatus(payrollData.status)) {
      throw new ValidationError('Estado de nómina inválido. Use: activo o retirado');
    }
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
  public async getAllPayrolls(): Promise<PayrollWithDetails[]> {
    this.logger.info('Getting all payrolls');
    return await this.payrollRepository.findAll();
  }
  public async getPayrollByUserId(userId: number): Promise<Payroll> {
    this.logger.info('Getting payroll by user ID', { userId });
    if (!Validator.isPositiveInteger(userId)) {
      throw new ValidationError('ID de usuario inválido');
    }
    const payroll = await this.payrollRepository.findByUserId(userId);
    if (!payroll) {
      throw new NotFoundError(`No se encontró nómina para el usuario con ID ${userId}`);
    }
    return payroll;
  }
  public async getActivePayrollByUserId(userId: number): Promise<Payroll> {
    this.logger.info('Getting active payroll by user ID', { userId });
    if (!Validator.isPositiveInteger(userId)) {
      throw new ValidationError('ID de usuario inválido');
    }
    const payroll = await this.payrollRepository.findActiveByUserId(userId);
    if (!payroll) {
      throw new NotFoundError(
        `No se encontró nómina activa para el usuario con ID ${userId}`
      );
    }
    return payroll;
  }
  public async getAllCompanies(): Promise<Company[]> {
    this.logger.info('Getting all companies');
    return await this.payrollRepository.getAllCompanies();
  }
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
