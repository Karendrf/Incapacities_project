"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = require("../middlewares/validateRequest");
const PayrollStatus_1 = require("../../../../domain/enums/PayrollStatus");
class PayrollRoutes {
    constructor(payrollController) {
        this.payrollController = payrollController;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        // All routes require authentication and admin role
        this.router.use(authMiddleware_1.AuthMiddleware.authenticate);
        this.router.use(authMiddleware_1.AuthMiddleware.requireAdmin);
        // Create payroll
        this.router.post('/createPayroll', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.body)('userDocument')
                .notEmpty()
                .withMessage('El documento del usuario es requerido')
                .isString()
                .withMessage('El documento debe ser un string')
                .matches(/^[0-9]{6,15}$/)
                .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
            (0, express_validator_1.body)('companyId')
                .notEmpty()
                .withMessage('El ID de la empresa es requerido')
                .isInt({ min: 1 })
                .withMessage('El ID de la empresa debe ser un número positivo'),
            (0, express_validator_1.body)('position')
                .optional()
                .isString()
                .withMessage('El cargo debe ser un string')
                .isLength({ max: 100 })
                .withMessage('El cargo no puede exceder 100 caracteres'),
            (0, express_validator_1.body)('status')
                .notEmpty()
                .withMessage('El estado es requerido')
                .isIn(Object.values(PayrollStatus_1.PayrollStatus))
                .withMessage(`El estado debe ser: ${Object.values(PayrollStatus_1.PayrollStatus).join(' o ')}`),
        ]), this.payrollController.createPayroll);
        // Update payroll
        this.router.put('/updatePayroll/:id', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID inválido'),
            (0, express_validator_1.body)('companyId')
                .optional()
                .isInt({ min: 1 })
                .withMessage('El ID de la empresa debe ser un número positivo'),
            (0, express_validator_1.body)('position')
                .optional()
                .isString()
                .withMessage('El cargo debe ser un string')
                .isLength({ max: 100 })
                .withMessage('El cargo no puede exceder 100 caracteres'),
            (0, express_validator_1.body)('status')
                .optional()
                .isIn(Object.values(PayrollStatus_1.PayrollStatus))
                .withMessage(`El estado debe ser: ${Object.values(PayrollStatus_1.PayrollStatus).join(' o ')}`),
        ]), this.payrollController.updatePayroll);
        // Get payroll by ID
        this.router.get('/getPayrollById/:id', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID inválido'),
        ]), this.payrollController.getPayrollById);
        // Get all payrolls
        this.router.get('/getAllPayrolls', this.payrollController.getAllPayrolls);
        // Get payroll by user document
        this.router.get('/getPayrollByDocument/:document', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.param)('document')
                .matches(/^[0-9]{6,15}$/)
                .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
        ]), this.payrollController.getPayrollByUserDocument);
        // Get active payroll by user document
        this.router.get('/getActivePayrollByDocument/:document', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.param)('document')
                .matches(/^[0-9]{6,15}$/)
                .withMessage('Formato de documento inválido. Debe contener entre 6 y 15 dígitos'),
        ]), this.payrollController.getActivePayrollByUserDocument);
        // Get all companies
        this.router.get('/companies', this.payrollController.getAllCompanies);
        // Delete payroll
        this.router.delete('/deletePayroll/:id', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID inválido'),
        ]), this.payrollController.deletePayroll);
    }
    getRouter() {
        return this.router;
    }
}
exports.PayrollRoutes = PayrollRoutes;
//# sourceMappingURL=PayrollRoutes.js.map