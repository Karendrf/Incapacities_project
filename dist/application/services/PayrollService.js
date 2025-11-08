"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const NotFoundError_1 = require("../../shared/errors/NotFoundError");
const ValidationError_1 = require("../../shared/errors/ValidationError");
const validator_1 = require("../../shared/utils/validator");
const logger_1 = require("../../shared/utils/logger");
class PayrollService {
    constructor(payrollRepository) {
        this.payrollRepository = payrollRepository;
        this.logger = new logger_1.Logger('PayrollService');
    }
    async createPayroll(payrollData) {
        this.logger.info('Creating new payroll', { userDocument: payrollData.userDocument });
        // Validate required fields
        validator_1.Validator.validateRequiredFields(payrollData, ['userDocument', 'companyId', 'status']);
        // Validate document format
        if (!validator_1.Validator.isValidDocument(payrollData.userDocument)) {
            throw new ValidationError_1.ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
        }
        // Validate company exists
        const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
        if (!company) {
            throw new NotFoundError_1.NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
        }
        // Validate status
        if (!validator_1.Validator.isValidStatus(payrollData.status)) {
            throw new ValidationError_1.ValidationError('Estado de nómina inválido. Use: activo o retirado');
        }
        // Check if user already has a payroll
        const existingPayroll = await this.payrollRepository.findByUserDocument(payrollData.userDocument);
        if (existingPayroll) {
            throw new ValidationError_1.ValidationError(`El usuario con documento ${payrollData.userDocument} ya tiene una nómina registrada`);
        }
        // Sanitize optional fields
        if (payrollData.position) {
            payrollData.position = validator_1.Validator.sanitizeString(payrollData.position);
        }
        try {
            const payroll = await this.payrollRepository.create(payrollData);
            this.logger.info('Payroll created successfully', {
                id: payroll.id,
                userDocument: payroll.userDocument
            });
            return payroll;
        }
        catch (error) {
            this.logger.error('Error creating payroll', error);
            throw error;
        }
    }
    async updatePayroll(id, payrollData) {
        this.logger.info('Updating payroll', { id });
        // Validate ID
        if (!validator_1.Validator.isPositiveInteger(id)) {
            throw new ValidationError_1.ValidationError('ID de nómina inválido');
        }
        // Check if payroll exists
        const existingPayroll = await this.payrollRepository.findById(id);
        if (!existingPayroll) {
            throw new NotFoundError_1.NotFoundError(`Nómina con ID ${id} no encontrada`);
        }
        // Validate company if provided
        if (payrollData.companyId) {
            const company = await this.payrollRepository.getCompanyById(payrollData.companyId);
            if (!company) {
                throw new NotFoundError_1.NotFoundError(`Empresa con ID ${payrollData.companyId} no encontrada`);
            }
        }
        // Validate status if provided
        if (payrollData.status && !validator_1.Validator.isValidStatus(payrollData.status)) {
            throw new ValidationError_1.ValidationError('Estado de nómina inválido. Use: activo o retirado');
        }
        // Sanitize optional fields
        if (payrollData.position) {
            payrollData.position = validator_1.Validator.sanitizeString(payrollData.position);
        }
        try {
            const updatedPayroll = await this.payrollRepository.update(id, payrollData);
            this.logger.info('Payroll updated successfully', { id });
            return updatedPayroll;
        }
        catch (error) {
            this.logger.error('Error updating payroll', error);
            throw error;
        }
    }
    async getPayrollById(id) {
        this.logger.info('Getting payroll by ID', { id });
        if (!validator_1.Validator.isPositiveInteger(id)) {
            throw new ValidationError_1.ValidationError('ID de nómina inválido');
        }
        const payroll = await this.payrollRepository.findById(id);
        if (!payroll) {
            throw new NotFoundError_1.NotFoundError(`Nómina con ID ${id} no encontrada`);
        }
        return payroll;
    }
    async getAllPayrolls() {
        this.logger.info('Getting all payrolls');
        return await this.payrollRepository.findAll();
    }
    async getPayrollByUserDocument(userDocument) {
        this.logger.info('Getting payroll by user document', { userDocument });
        if (!validator_1.Validator.isValidDocument(userDocument)) {
            throw new ValidationError_1.ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
        }
        const payroll = await this.payrollRepository.findByUserDocument(userDocument);
        if (!payroll) {
            throw new NotFoundError_1.NotFoundError(`No se encontró nómina para el documento ${userDocument}`);
        }
        return payroll;
    }
    async getActivePayrollByUserDocument(userDocument) {
        this.logger.info('Getting active payroll by user document', { userDocument });
        if (!validator_1.Validator.isValidDocument(userDocument)) {
            throw new ValidationError_1.ValidationError('Formato de documento inválido. Debe contener entre 6 y 15 dígitos');
        }
        const payroll = await this.payrollRepository.findActiveByUserDocument(userDocument);
        if (!payroll) {
            throw new NotFoundError_1.NotFoundError(`No se encontró nómina activa para el documento ${userDocument}`);
        }
        return payroll;
    }
    async getAllCompanies() {
        this.logger.info('Getting all companies');
        return await this.payrollRepository.getAllCompanies();
    }
    async deletePayroll(id) {
        this.logger.info('Deleting payroll', { id });
        if (!validator_1.Validator.isPositiveInteger(id)) {
            throw new ValidationError_1.ValidationError('ID de nómina inválido');
        }
        const exists = await this.payrollRepository.findById(id);
        if (!exists) {
            throw new NotFoundError_1.NotFoundError(`Nómina con ID ${id} no encontrada`);
        }
        const deleted = await this.payrollRepository.delete(id);
        if (!deleted) {
            throw new Error('Error al eliminar la nómina');
        }
        this.logger.info('Payroll deleted successfully', { id });
    }
}
exports.PayrollService = PayrollService;
//# sourceMappingURL=PayrollService.js.map