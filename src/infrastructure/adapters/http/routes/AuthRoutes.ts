import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { ValidateRequest } from '../middlewares/validateRequest';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.configureRoutes();
  }

  private configureRoutes(): void {
    // Login - NO requiere autenticación
    this.router.post(
      '/login',
      ValidateRequest.validate([
        body('username')
          .notEmpty()
          .withMessage('El nombre de usuario es requerido'),
        body('password')
          .notEmpty()
          .withMessage('La contraseña es requerida'),
      ]),
      this.authController.login
    );

    // Obtener información del usuario actual - SÍ requiere autenticación
    this.router.get(
      '/me',
      AuthMiddleware.authenticate,
      this.authController.me
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}