import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    private readonly logger;
    private readonly authService;
    constructor();
    /**
     * Endpoint de login
     */
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    /**
     * Endpoint para obtener información del usuario actual
     */
    me: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map