import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
export declare class ValidateRequest {
    static validate(validations: ValidationChain[]): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=validateRequest.d.ts.map