import * as jwt from 'jsonwebtoken';
import { LoginRequest, LoginResponse } from '../../domain/models/AuthUser';
import { AuthUserModel } from '../../infrastructure/adapters/persistence/models/AuthUserModel';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';
import { Logger } from '../../shared/utils/logger';
import { serverConfig } from '../../infrastructure/config/server.config';

export class AuthService {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger('AuthService');
  }

  /**
   * Autenticar usuario y generar token JWT
   */
  public async login(loginData: LoginRequest): Promise<LoginResponse> {
    this.logger.info('Login attempt', { username: loginData.username });

    // Buscar usuario
    const user = await AuthUserModel.findOne({
      where: { username: loginData.username },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar contraseña (en este caso simple, sin hash)
    // NOTA: En producción deberías usar bcrypt
    if (user.password !== loginData.password) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token JWT - CORREGIDO
    const token = jwt.sign(
    {
    userId: user.id.toString(),
    role: user.role,
    document: user.document,
    },
    serverConfig.jwtSecret as string,
    {
    algorithm: 'HS256',
    }
    );


    this.logger.info('Login successful', { 
      userId: user.id, 
      role: user.role 
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
   * Verificar y decodificar un token
   */
  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, serverConfig.jwtSecret as string);
    } catch (error) {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }
}