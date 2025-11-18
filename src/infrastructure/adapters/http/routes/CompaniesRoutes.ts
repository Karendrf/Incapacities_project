import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

/**
 * Configuración de rutas para el módulo de empresas
 */
export class CompanyRoutes {
  private router: Router;

  constructor(private readonly payrollController: PayrollController) {
    this.router = Router();
    this.configureRoutes();
  }

  /**
   * Configura todas las rutas del módulo de empresas
   * Todas las rutas requieren autenticación
   */
  private configureRoutes(): void {
    this.router.use(AuthMiddleware.authenticate);
    //Obtiene todas las empresas
    this.router.get(
      '/',
      this.payrollController.getAllCompanies
    );

  }

  /**
   *Obtiene el router configurado
   */
  public getRouter(): Router {
    return this.router;
  }
}