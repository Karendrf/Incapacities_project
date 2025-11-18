import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
export declare class CompanyRoutes {
    private readonly payrollController;
    private router;
    constructor(payrollController: PayrollController);
    private configureRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=CompaniesRoutes.d.ts.map