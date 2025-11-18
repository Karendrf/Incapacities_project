import { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    id: number;
    role: string;
    iat?: number;
    exp?: number;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare class AuthMiddleware {
    static authenticate(req: Request, _res: Response, next: NextFunction): void;
    static requireAdmin(req: Request, _res: Response, next: NextFunction): void;
    static requireEmployee(req: Request, _res: Response, next: NextFunction): void;
    static requireOwnerOrAdmin(req: Request, _res: Response, next: NextFunction): void;
}
//# sourceMappingURL=authMiddleware.d.ts.map