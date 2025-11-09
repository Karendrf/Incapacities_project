import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../../../application/services/AuthService';
import { Logger } from '../../../../shared/utils/logger';

export class AuthController {
  private readonly logger: Logger;
  private readonly authService: AuthService;

  constructor() {
    this.logger = new Logger('AuthController');
    this.authService = new AuthService();
  }

  /**
   * Endpoint de login
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('POST /login - User attempting to login');

      const { username, password } = req.body;

      const result = await this.authService.login({ username, password });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Endpoint para obtener información del usuario actual
   */
  public me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // El usuario ya está en req.user por el middleware de autenticación
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  };
}