import { Request, Response, NextFunction } from 'express';
export interface JwtPayload {
    userId: string;
    role: string;
    document: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
export declare class AuthMiddleware {
    private static readonly logger;
    static authenticate(req: Request, _res: Response, next: NextFunction): void;
    static requireAdmin(req: Request, _res: Response, next: NextFunction): void;
}
//# sourceMappingURL=authMiddleware.d.ts.map