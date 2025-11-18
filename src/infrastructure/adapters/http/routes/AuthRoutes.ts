import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { ValidateRequest } from '../middlewares/validateRequest';
import { AuthMiddleware } from '../middlewares/authMiddleware';

/**
 * Rutas relacionadas con autenticación.
 * Maneja login y consulta de información del usuario autenticado.
 */
export class AuthRoutes {
  private router: Router;
  private authController: AuthController;
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.configureRoutes();
  }

  /**
   * Configura las rutas del módulo de autenticación.
   * - POST /login  → Inicio de sesión
   * - GET /me      → Información del usuario autenticado
   */
  private configureRoutes(): void {
    /**
     * POST /login
     * *No requiere autenticación*
     * Valida:
     *  - username obligatorio
     *  - password obligatoria
     * Controlador:
     *  - AuthController.login
     */
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
    /**
     * GET /me
     * Requiere autenticación
     * Devuelve la información del usuario extraída del token JWT.
     */
    this.router.get(
      '/me',
      AuthMiddleware.authenticate,
      this.authController.me
    );
  }
  /**
   * Retorna el router configurado para ser usado en index.ts
   */
  public getRouter(): Router {
    return this.router;
  }
}
