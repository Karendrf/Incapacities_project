import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginRequest, LoginResponse } from '../../domain/models/AuthUser';
import { AuthUserModel } from '../../infrastructure/adapters/persistence/models/AuthUserModel';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';
import { Logger } from '../../shared/utils/logger';
import { serverConfig } from '../../infrastructure/config/server.config';

/**
 * Servicio de autenticación
 * Maneja el proceso de login, generación y verificación de tokens JWT
 */
export class AuthService {
  private readonly logger: Logger;
  private static readonly SALT_ROUNDS = 10;
  private static readonly TOKEN_EXPIRATION = '24h';
  constructor() {
    this.logger = new Logger('AuthService');
  }

  /**
   * Realiza el login de un usuario
   * - Verifica credenciales
   * - Valida contraseña con bcrypt
   * - Genera token JWT
   */
  public async login(loginData: LoginRequest): Promise<LoginResponse> {
    this.logger.info('Intento de login', { username: loginData.username });
    // Validar entrada
    this.validateLoginData(loginData);
    // Buscar usuario
    const user = await AuthUserModel.findOne({
      where: { username: loginData.username },
    });
    if (!user) {
      this.logger.warn('Usuario no encontrado', { username: loginData.username });
      throw new UnauthorizedError('Credenciales inválidas');
    }
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      this.logger.warn('Contraseña inválida', {
        userId: user.id,
        username: user.username,
      });
      throw new UnauthorizedError('Credenciales inválidas');
    }
    // Generar token
    const token = this.generateToken({
      userId: user.id.toString(),
      role: user.role,
      document: user.document,
    });
    this.logger.info('Login exitoso', {
      userId: user.id,
      role: user.role,
      username: user.username,
    });
    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        document: user.document,
        name: user.name,
      },
    };
  }

  /**
   * Genera un token JWT
   */
  private generateToken(payload: {
    userId: string;
    role: string;
    document: string;
  }): string {
    try {
      const secret = serverConfig.jwtSecret; 
      if (!secret) {
        throw new Error('JWT_SECRET no configurado');
      }
      return jwt.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn: serverConfig.jwtExpiration || AuthService.TOKEN_EXPIRATION,
        issuer: serverConfig.serviceName,
        subject: payload.userId,
      } as jwt.SignOptions);
    } catch (error) {
      this.logger.error('Error generando token JWT', error as Error);
      throw new Error('Error generando token de autenticación');
    }
  }

  /**
   * Verifica un token JWT
   */
  public verifyToken(token: string): jwt.JwtPayload {
    try {
      return jwt.verify(token, serverConfig.jwtSecret, {
        algorithms: ['HS256'],
        issuer: serverConfig.serviceName,
      }) as jwt.JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado. Inicie sesión nuevamente');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      }
      throw new UnauthorizedError('Error verificando token');
    }
  }

  /**
   * Hashea una contraseña usando bcrypt
   */
  public static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, AuthService.SALT_ROUNDS);
    } catch (error) {
      throw new Error('Error hasheando contraseña');
    }
  }

  /**
   * Valida los datos recibidos en el login
   */
  private validateLoginData(loginData: LoginRequest): void {
    if (!loginData.username || !loginData.password) {
      throw new UnauthorizedError('Usuario y contraseña son requeridos');
    }
    if (typeof loginData.username !== 'string' || typeof loginData.password !== 'string') {
      throw new UnauthorizedError('Formato inválido');
    }
    if (loginData.username.length < 3 || loginData.username.length > 50) {
      throw new UnauthorizedError('Usuario debe tener entre 3 y 50 caracteres');
    }
    if (loginData.password.length < 6) {
      throw new UnauthorizedError('Contraseña debe tener mínimo 6 caracteres');
    }
  }

  /**
   * Refresca un token JWT existente
   */
  public async refreshToken(currentToken: string): Promise<string> {
    try {
      const decoded = this.verifyToken(currentToken);
      return this.generateToken({
        userId: decoded.userId as string,
        role: decoded.role as string,
        document: decoded.document as string,
      });
    } catch (error) {
      this.logger.error('Error refrescando token', error as Error);
      throw error;
    }
  }
}
