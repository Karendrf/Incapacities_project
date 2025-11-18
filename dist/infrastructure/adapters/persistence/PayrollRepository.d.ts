import { IPayrollRepository } from '../../../application/ports/out/IPayrollRepository';
import { Payroll, PayrollWithDetails } from '../../../domain/models/Payroll';
import { Company } from '../../../domain/models/Company';
import { CreatePayrollDto } from '../../../application/dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../../../application/dto/UpdatePayrollDto';
export declare class PayrollRepository implements IPayrollRepository {
    private readonly logger;
    constructor();
    create(payrollData: CreatePayrollDto): Promise<Payroll>;
    update(id: number, payrollData: UpdatePayrollDto): Promise<Payroll>;
    findById(id: number): Promise<PayrollWithDetails | null>;
    findAll(): Promise<PayrollWithDetails[]>;
    findByUserDocument(userDocument: string): Promise<Payroll | null>;
    findActiveByUserDocument(userDocument: string): Promise<Payroll | null>;
    getAllCompanies(): Promise<Company[]>;
    getCompanyById(id: number): Promise<Company | null>;
    delete(id: number): Promise<boolean>;
    private mapToPayroll;
    private mapToPayrollWithDetails;
    private mapToCompany;
}
//# sourceMappingURL=PayrollRepository.d.ts.map