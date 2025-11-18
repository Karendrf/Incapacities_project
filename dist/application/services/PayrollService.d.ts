import { IPayrollService } from '../ports/in/IPayrollService';
import { IPayrollRepository } from '../ports/out/IPayrollRepository';
import { Payroll, PayrollWithDetails } from '../../domain/models/Payroll';
import { Company } from '../../domain/models/Company';
import { CreatePayrollDto } from '../dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../dto/UpdatePayrollDto';
export declare class PayrollService implements IPayrollService {
    private readonly payrollRepository;
    private readonly logger;
    constructor(payrollRepository: IPayrollRepository);
    createPayroll(payrollData: CreatePayrollDto): Promise<Payroll>;
    updatePayroll(id: number, payrollData: UpdatePayrollDto): Promise<Payroll>;
    getPayrollById(id: number): Promise<PayrollWithDetails>;
    getAllPayrolls(): Promise<PayrollWithDetails[]>;
    getPayrollByUserDocument(userDocument: string): Promise<Payroll>;
    getActivePayrollByUserDocument(userDocument: string): Promise<Payroll>;
    getAllCompanies(): Promise<Company[]>;
    deletePayroll(id: number): Promise<void>;
}
//# sourceMappingURL=PayrollService.d.ts.map