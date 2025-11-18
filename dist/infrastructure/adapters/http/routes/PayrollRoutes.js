"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const PayrollValidations_1 = require("../validations/PayrollValidations");
class PayrollRoutes {
    constructor(payrollController) {
        this.payrollController = payrollController;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.use(authMiddleware_1.AuthMiddleware.authenticate);
        this.router.post('/', authMiddleware_1.AuthMiddleware.requireAdmin, PayrollValidations_1.PayrollValidations.create(), this.payrollController.createPayroll);
        this.router.put('/:id', authMiddleware_1.AuthMiddleware.requireAdmin, PayrollValidations_1.PayrollValidations.update(), this.payrollController.updatePayroll);
        this.router.get('/:id', PayrollValidations_1.PayrollValidations.getById(), authMiddleware_1.AuthMiddleware.requireOwnerOrAdmin, this.payrollController.getPayrollById);
        this.router.get('/', authMiddleware_1.AuthMiddleware.requireAdmin, this.payrollController.getAllPayrolls);
        this.router.get('/document/:document', PayrollValidations_1.PayrollValidations.getByDocument(), authMiddleware_1.AuthMiddleware.requireOwnerOrAdmin, this.payrollController.getPayrollByUserDocument);
        this.router.get('/document/:document/active', PayrollValidations_1.PayrollValidations.getByDocument(), authMiddleware_1.AuthMiddleware.requireOwnerOrAdmin, this.payrollController.getActivePayrollByUserDocument);
        this.router.delete('/:id', authMiddleware_1.AuthMiddleware.requireAdmin, PayrollValidations_1.PayrollValidations.delete(), this.payrollController.deletePayroll);
    }
    getRouter() {
        return this.router;
    }
}
exports.PayrollRoutes = PayrollRoutes;
//# sourceMappingURL=PayrollRoutes.js.map