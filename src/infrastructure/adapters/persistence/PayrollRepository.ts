import { IPayrollRepository } from '../../../application/ports/out/IPayrollRepository';
import { Payroll, PayrollWithDetails } from '../../../domain/models/Payroll';
import { Company } from '../../../domain/models/Company';
import { CreatePayrollDto } from '../../../application/dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../../../application/dto/UpdatePayrollDto';
import { PayrollModel, CompanyModel } from './models';
import { Logger } from '../../../shared/utils/logger';
import { PayrollStatus } from '../../../domain/enums/PayrollStatus';
export class PayrollRepository implements IPayrollRepository {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger('PayrollRepository');
  }
  public async create(payrollData: CreatePayrollDto): Promise<Payroll> {
    try {
      const payroll = await PayrollModel.create({
        userDocument: payrollData.userDocument,
        companyId: payrollData.companyId,
        position: payrollData.position || null,
        status: payrollData.status,
      });
      return this.mapToPayroll(payroll);
    } catch (error) {
      this.logger.error('Error creating payroll', error as Error);
      throw error;
    }
  }
  public async update(id: number, payrollData: UpdatePayrollDto): Promise<Payroll> {
    try {
      const payroll = await PayrollModel.findByPk(id);   
      if (!payroll) {
        throw new Error('Payroll not found');
      }
      await payroll.update({
        ...(payrollData.companyId && { companyId: payrollData.companyId }),
        ...(payrollData.position !== undefined && { position: payrollData.position }),
        ...(payrollData.status && { status: payrollData.status }),
      });
      return this.mapToPayroll(payroll);
    } catch (error) {
      this.logger.error('Error updating payroll', error as Error);
      throw error;
    }
  }
  public async findById(id: number): Promise<PayrollWithDetails | null> {
    try {
      const payroll = await PayrollModel.findByPk(id, {
        include: [
          {
            model: CompanyModel,
            as: 'company',
            attributes: ['id', 'name', 'nit', 'address', 'phone'],
          },
        ],
      });
      if (!payroll) {
        return null;
      }
      return this.mapToPayrollWithDetails(payroll);
    } catch (error) {
      this.logger.error('Error finding payroll by ID', error as Error);
      throw error;
    }
  }
  public async findAll(): Promise<PayrollWithDetails[]> {
    try {
      const payrolls = await PayrollModel.findAll({
        include: [
          {
            model: CompanyModel,
            as: 'company',
            attributes: ['id', 'name', 'nit', 'address', 'phone'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return payrolls.map(payroll => this.mapToPayrollWithDetails(payroll));
    } catch (error) {
      this.logger.error('Error finding all payrolls', error as Error);
      throw error;
    }
  }
  public async findByUserDocument(userDocument: string): Promise<Payroll | null> {
    try {
      const payroll = await PayrollModel.findOne({
        where: { userDocument },
      });
      if (!payroll) {
        return null;
      }
      return this.mapToPayroll(payroll);
    } catch (error) {
      this.logger.error('Error finding payroll by user document', error as Error);
      throw error;
    }
  }
  public async findActiveByUserDocument(userDocument: string): Promise<Payroll | null> {
    try {
      const payroll = await PayrollModel.findOne({
        where: {
          userDocument,
          status: PayrollStatus.ACTIVO,
        },
      });
      if (!payroll) {
        return null;
      }
      return this.mapToPayroll(payroll);
    } catch (error) {
      this.logger.error('Error finding active payroll by user document', error as Error);
      throw error;
    }
  }
  public async getAllCompanies(): Promise<Company[]> {
    try {
      const companies = await CompanyModel.findAll({
        order: [['name', 'ASC']],
      });
      return companies.map(company => this.mapToCompany(company));
    } catch (error) {
      this.logger.error('Error getting all companies', error as Error);
      throw error;
    }
  }
  public async getCompanyById(id: number): Promise<Company | null> {
    try {
      const company = await CompanyModel.findByPk(id);
      if (!company) {
        return null;
      }
      return this.mapToCompany(company);
    } catch (error) {
      this.logger.error('Error getting company by ID', error as Error);
      throw error;
    }
  }
  public async delete(id: number): Promise<boolean> {
    try {
      const result = await PayrollModel.destroy({
        where: { id },
      });
      return result > 0;
    } catch (error) {
      this.logger.error('Error deleting payroll', error as Error);
      throw error;
    }
  }
  private mapToPayroll(payrollModel: PayrollModel): Payroll {
    return {
      id: payrollModel.id,
      userDocument: payrollModel.userDocument,
      companyId: payrollModel.companyId,
      position: payrollModel.position || undefined,
      status: payrollModel.status,
      createdAt: payrollModel.createdAt,
      updatedAt: payrollModel.updatedAt,
    };
  }
  private mapToPayrollWithDetails(payrollModel: PayrollModel): PayrollWithDetails {
    const payroll = this.mapToPayroll(payrollModel);
    if (payrollModel.company) {
      return {
        ...payroll,
        company: {
          id: payrollModel.company.id,
          name: payrollModel.company.name,
          nit: payrollModel.company.nit,
          address: payrollModel.company.address || undefined,
          phone: payrollModel.company.phone || undefined,
        },
      };
    }
    return payroll;
  }
  private mapToCompany(companyModel: CompanyModel): Company {
    return {
      id: companyModel.id,
      name: companyModel.name,
      nit: companyModel.nit,
      address: companyModel.address || undefined,
      phone: companyModel.phone || undefined,
      createdAt: companyModel.createdAt,
      updatedAt: companyModel.updatedAt,
    };
  }
}