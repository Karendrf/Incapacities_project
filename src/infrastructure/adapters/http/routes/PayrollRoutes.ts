import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { PayrollValidations } from '../validations/PayrollValidations';
export class PayrollRoutes {
  private router: Router;
  constructor(private readonly payrollController: PayrollController) {
    this.router = Router();
    this.configureRoutes();
  }
  private configureRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);
    this.router.post(
      '/',
      AuthMiddleware.requireAdmin,
      PayrollValidations.create(),
      this.payrollController.createPayroll
    );
    this.router.put(
      '/:id',
      AuthMiddleware.requireAdmin,
      PayrollValidations.update(),
      this.payrollController.updatePayroll
    );
    this.router.get(
      '/:id',
      PayrollValidations.getById(),
      AuthMiddleware.requireOwnerOrAdmin,
      this.payrollController.getPayrollById
    );
    this.router.get(
      '/',
      AuthMiddleware.requireAdmin,
      this.payrollController.getAllPayrolls
    );
    this.router.get(
      '/user/:userId',
      PayrollValidations.getByUserId(),
      AuthMiddleware.requireOwnerOrAdmin,
      this.payrollController.getPayrollByUserId
    );
    this.router.get(
      '/user/:userId/active',
      PayrollValidations.getByUserId(),
      AuthMiddleware.requireOwnerOrAdmin,
      this.payrollController.getActivePayrollByUserId
    );
    this.router.delete(
      '/:id',
      AuthMiddleware.requireAdmin,
      PayrollValidations.delete(),
      this.payrollController.deletePayroll
    );
  }
  public getRouter(): Router {
    return this.router;
  }
}