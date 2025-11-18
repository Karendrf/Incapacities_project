import { Router } from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { PayrollValidations } from '../validations/PayrollValidations';

/**
 * Configuración de rutas para el módulo de nómina
 * Implementa endpoints RESTful con validaciones y autorización
 */
export class PayrollRoutes {
  private router: Router;

  constructor(private readonly payrollController: PayrollController) {
    this.router = Router();
    this.configureRoutes();
  }

  /**
   * Configura todas las rutas del módulo de nómina
   * Todas las rutas requieren autenticación
   */
  private configureRoutes(): void {
    // Todas las rutas requieren autenticación
    this.router.use(AuthMiddleware.authenticate);

    // Crear nómina - Solo administradores
    this.router.post(
      '/',
      AuthMiddleware.requireAdmin,
      PayrollValidations.create(),
      this.payrollController.createPayroll
    );

    // Actualizar nómina - Solo administradores
    this.router.put(
      '/:id',
      AuthMiddleware.requireAdmin,
      PayrollValidations.update(),
      this.payrollController.updatePayroll
    );

    // Buscar nómina por ID - Administradores o propietario
    this.router.get(
      '/:id',
      PayrollValidations.getById(),
      AuthMiddleware.requireOwnerOrAdmin('payroll'),
      this.payrollController.getPayrollById
    );

    // Buscar todas las nóminas - Solo administradores
    this.router.get(
      '/',
      AuthMiddleware.requireAdmin,
      this.payrollController.getAllPayrolls
    );

    // Buscar nómina por documento - Administradores o propietario
    this.router.get(
      '/document/:document',
      PayrollValidations.getByDocument(),
      AuthMiddleware.requireOwnerOrAdmin('document'),
      this.payrollController.getPayrollByUserDocument
    );

    // Buscar nómina activa por documento - Administradores o propietario
    this.router.get(
      '/document/:document/active',
      PayrollValidations.getByDocument(),
      AuthMiddleware.requireOwnerOrAdmin('document'),
      this.payrollController.getActivePayrollByUserDocument
    );

    // Eliminar nómina - Solo administradores
    this.router.delete(
      '/:id',
      AuthMiddleware.requireAdmin,
      PayrollValidations.delete(),
      this.payrollController.deletePayroll
    );
  }

  /**
   * Obtiene el router configurado
   */
  public getRouter(): Router {
    return this.router;
  }
}