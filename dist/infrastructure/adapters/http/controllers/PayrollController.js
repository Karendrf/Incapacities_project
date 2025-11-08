"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollController = void 0;
const logger_1 = require("../../../../shared/utils/logger");
class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
        this.createPayroll = async (req, res, next) => {
            try {
                this.logger.info('POST /createPayroll - Creating new payroll', {
                    userDocument: req.body.userDocument,
                });
                const createPayrollDto = {
                    userDocument: req.body.userDocument,
                    companyId: parseInt(req.body.companyId, 10),
                    position: req.body.position,
                    status: req.body.status,
                };
                const payroll = await this.payrollService.createPayroll(createPayrollDto);
                res.status(201).json({
                    success: true,
                    message: 'Nómina creada exitosamente',
                    data: payroll,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.updatePayroll = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                this.logger.info(`PUT /updatePayroll/${id} - Updating payroll`);
                const updatePayrollDto = {};
                if (req.body.companyId !== undefined) {
                    updatePayrollDto.companyId = parseInt(req.body.companyId, 10);
                }
                if (req.body.position !== undefined) {
                    updatePayrollDto.position = req.body.position;
                }
                if (req.body.status !== undefined) {
                    updatePayrollDto.status = req.body.status;
                }
                const payroll = await this.payrollService.updatePayroll(id, updatePayrollDto);
                res.status(200).json({
                    success: true,
                    message: 'Nómina actualizada exitosamente',
                    data: payroll,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPayrollById = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                this.logger.info(`GET /getPayrollById/${id} - Getting payroll by ID`);
                const payroll = await this.payrollService.getPayrollById(id);
                res.status(200).json({
                    success: true,
                    data: payroll,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllPayrolls = async (_req, res, next) => {
            try {
                this.logger.info('GET /getAllPayrolls - Getting all payrolls');
                const payrolls = await this.payrollService.getAllPayrolls();
                res.status(200).json({
                    success: true,
                    count: payrolls.length,
                    data: payrolls,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getPayrollByUserDocument = async (req, res, next) => {
            try {
                const userDocument = req.params.document;
                this.logger.info(`GET /getPayrollByDocument/${userDocument} - Getting payroll by user document`);
                const payroll = await this.payrollService.getPayrollByUserDocument(userDocument);
                res.status(200).json({
                    success: true,
                    data: payroll,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getActivePayrollByUserDocument = async (req, res, next) => {
            try {
                const userDocument = req.params.document;
                this.logger.info(`GET /getActivePayrollByDocument/${userDocument} - Getting active payroll by user document`);
                const payroll = await this.payrollService.getActivePayrollByUserDocument(userDocument);
                res.status(200).json({
                    success: true,
                    data: payroll,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAllCompanies = async (_req, res, next) => {
            try {
                this.logger.info('GET /companies - Getting all companies');
                const companies = await this.payrollService.getAllCompanies();
                res.status(200).json({
                    success: true,
                    count: companies.length,
                    data: companies,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.deletePayroll = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                this.logger.info(`DELETE /deletePayroll/${id} - Deleting payroll`);
                await this.payrollService.deletePayroll(id);
                res.status(200).json({
                    success: true,
                    message: 'Nómina eliminada exitosamente',
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.logger = new logger_1.Logger('PayrollController');
    }
}
exports.PayrollController = PayrollController;
//# sourceMappingURL=PayrollController.js.map