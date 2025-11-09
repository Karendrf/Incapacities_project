import { LoginRequest, LoginResponse } from '../../domain/models/AuthUser';
export declare class AuthService {
    private readonly logger;
    constructor();
    /**
     * Autenticar usuario y generar token JWT
     */
    login(loginData: LoginRequest): Promise<LoginResponse>;
    /**
     * Verificar y decodificar un token
     */
    verifyToken(token: string): any;
}
//# sourceMappingURL=AuthService.d.ts.map