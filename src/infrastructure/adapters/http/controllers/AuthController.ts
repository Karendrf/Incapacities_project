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
   * Maneja el inicio de sesión de un usuario.
   * Recibe username y password, delega al AuthService
   * y devuelve un token JWT junto con los datos del usuario.
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('POST /login - Usuario intentando iniciar sesión');

      const { username, password } = req.body;

      const result = await this.authService.login({ username, password });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Devuelve la información del usuario autenticado.
   * El usuario viene adjunto en req.user desde el middleware de autenticación.
   */
  public me = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        user: req.user,
      });
    } catch (error) {
      next(error);
    }
  };
}
