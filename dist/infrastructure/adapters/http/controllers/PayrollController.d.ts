import { Request, Response, NextFunction } from 'express';
import { IPayrollService } from '../../../../application/ports/in/IPayrollService';
export declare class PayrollController {
    private readonly payrollService;
    private readonly logger;
    constructor(payrollService: IPayrollService);
    createPayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPayrollById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllPayrolls: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPayrollByUserDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getActivePayrollByUserDocument: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllCompanies: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePayroll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=PayrollController.d.ts.map