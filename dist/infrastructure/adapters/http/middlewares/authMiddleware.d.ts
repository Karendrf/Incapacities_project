import { Request, Response, NextFunction } from 'express';
import { IPayrollRepository } from '../../../../application/ports/out/IPayrollRepository';
export interface JwtPayload {
    userId: string;
    role: string;
    document: string;
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
    private static readonly logger;
    private static payrollRepository?;
    static configure(repository: IPayrollRepository): void;
    static authenticate(req: Request, _res: Response, next: NextFunction): void;
    static requireAdmin(req: Request, _res: Response, next: NextFunction): void;
    static requireEmployee(req: Request, _res: Response, next: NextFunction): void;
    static requireOwnerOrAdmin(resourceType: 'payroll' | 'document'): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
    private static validateOwnership;
    static optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
}
//# sourceMappingURL=authMiddleware.d.ts.map