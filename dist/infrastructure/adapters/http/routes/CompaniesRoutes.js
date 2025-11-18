"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
class CompanyRoutes {
    constructor(payrollController) {
        this.payrollController = payrollController;
        this.router = (0, express_1.Router)();
        this.configureRoutes();
    }
    configureRoutes() {
        this.router.use(authMiddleware_1.AuthMiddleware.authenticate);
        this.router.get('/', this.payrollController.getAllCompanies);
    }
    getRouter() {
        return this.router;
    }
}
exports.CompanyRoutes = CompanyRoutes;
//# sourceMappingURL=CompaniesRoutes.js.map