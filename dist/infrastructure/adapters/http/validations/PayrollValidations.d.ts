export declare class PayrollValidations {
    private static documentValidation;
    private static documentParamValidation;
    private static companyIdValidation;
    private static positionValidation;
    private static statusValidation;
    private static idParamValidation;
    static create(): (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    static update(): (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    static getById(): (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    static getByDocument(): (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
    static delete(): (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
}
//# sourceMappingURL=PayrollValidations.d.ts.map