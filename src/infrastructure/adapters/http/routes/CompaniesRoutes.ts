import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
export class CompanyRoutes {
  private router: Router;
  constructor(private readonly payrollController: PayrollController) {
    this.router = Router();
    this.configureRoutes();
  }
  private configureRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);
    this.router.get(
      '/',
      this.payrollController.getAllCompanies
    );
  }
  public getRouter(): Router {
    return this.router;
  }
}