import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
export declare class PayrollRoutes {
    private readonly payrollController;
    private router;
    constructor(payrollController: PayrollController);
    private configureRoutes;
    getRouter(): Router;
}
//# sourceMappingURL=PayrollRoutes.d.ts.map