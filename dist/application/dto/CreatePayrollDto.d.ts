import { PayrollStatus } from '../../domain/enums/PayrollStatus';
export interface CreatePayrollDto {
    userDocument: string;
    companyId: number;
    position?: string;
    status: PayrollStatus;
}
//# sourceMappingURL=CreatePayrollDto.d.ts.map