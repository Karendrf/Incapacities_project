import { Router } from 'express';
import { body, param } from 'express-validator';
import { PayrollController } from '../controllers/PayrollController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { ValidateRequest } from '../middlewares/validateRequest';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';

export class PayrollRoutes {
  private router: Router;

  constructor(private readonly payrollController: PayrollController) {
    this.router = Router();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // All routes require authentication and admin role
    this.router.use(AuthMiddleware.authenticate);
    this.router.use(AuthMiddleware.requireAdmin);

    // Create payroll
    this.router.post(
      '/createPayroll',
      ValidateRequest.validate([
        body('userDocument')
          .notEmpty()
          .withMessage('El documento del usuario es requerido')
          .isString()
          .withMessage('El documento debe ser un string')
          .matches(/^[0-9]{6,15}$/)
          .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
        body('companyId')
          .notEmpty()
          .withMessage('El ID de la empresa es requerido')
          .isInt({ min: 1 })
          .withMessage('El ID de la empresa debe ser un número positivo'),
        body('position')
          .optional()
          .isString()
          .withMessage('El cargo debe ser un string')
          .isLength({ max: 100 })
          .withMessage('El cargo no puede exceder 100 caracteres'),
        body('status')
          .notEmpty()
          .withMessage('El estado es requerido')
          .isIn(Object.values(PayrollStatus))
          .withMessage(`El estado debe ser: ${Object.values(PayrollStatus).join(' o ')}`),
      ]),
      this.payrollController.createPayroll
    );

    // Update payroll
    this.router.put(
      '/updatePayroll/:id',
      ValidateRequest.validate([
        param('id').isInt({ min: 1 }).withMessage('ID inválido'),
        body('companyId')
          .optional()
          .isInt({ min: 1 })
          .withMessage('El ID de la empresa debe ser un número positivo'),
        body('position')
          .optional()
          .isString()
          .withMessage('El cargo debe ser un string')
          .isLength({ max: 100 })
          .withMessage('El cargo no puede exceder 100 caracteres'),
        body('status')
          .optional()
          .isIn(Object.values(PayrollStatus))
          .withMessage(`El estado debe ser: ${Object.values(PayrollStatus).join(' o ')}`),
      ]),
      this.payrollController.updatePayroll
    );

    // Get payroll by ID
    this.router.get(
      '/getPayrollById/:id',
      ValidateRequest.validate([
        param('id').isInt({ min: 1 }).withMessage('ID inválido'),
      ]),
      this.payrollController.getPayrollById
    );

    // Get all payrolls
    this.router.get('/getAllPayrolls', this.payrollController.getAllPayrolls);

    // Get payroll by user document
    this.router.get(
      '/getPayrollByDocument/:document',
      ValidateRequest.validate([
        param('document')
          .matches(/^[0-9]{6,15}$/)
          .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
      ]),
      this.payrollController.getPayrollByUserDocument
    );

    // Get active payroll by user document
    this.router.get(
      '/getActivePayrollByDocument/:document',
      ValidateRequest.validate([
        param('document')
          .matches(/^[0-9]{6,15}$/)
          .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
      ]),
      this.payrollController.getActivePayrollByUserDocument
    );

    // Get all companies
    this.router.get('/companies', this.payrollController.getAllCompanies);

    // Delete payroll
    this.router.delete(
      '/deletePayroll/:id',
      ValidateRequest.validate([
        param('id').isInt({ min: 1 }).withMessage('ID inválido'),
      ]),
      this.payrollController.deletePayroll
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}