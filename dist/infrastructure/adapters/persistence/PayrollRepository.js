"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRepository = void 0;
const models_1 = require("./models");
const logger_1 = require("../../../shared/utils/logger");
const PayrollStatus_1 = require("../../../domain/enums/PayrollStatus");
class PayrollRepository {
    constructor() {
        this.logger = new logger_1.Logger('PayrollRepository');
    }
    async create(payrollData) {
        try {
            const payroll = await models_1.PayrollModel.create({
                userDocument: payrollData.userDocument,
                companyId: payrollData.companyId,
                position: payrollData.position || null,
                status: payrollData.status,
            });
            return this.mapToPayroll(payroll);
        }
        catch (error) {
            this.logger.error('Error creating payroll', error);
            throw error;
        }
    }
    async update(id, payrollData) {
        try {
            const payroll = await models_1.PayrollModel.findByPk(id);
            if (!payroll) {
                throw new Error('Payroll not found');
            }
            await payroll.update({
                ...(payrollData.companyId && { companyId: payrollData.companyId }),
                ...(payrollData.position !== undefined && { position: payrollData.position }),
                ...(payrollData.status && { status: payrollData.status }),
            });
            return this.mapToPayroll(payroll);
        }
        catch (error) {
            this.logger.error('Error updating payroll', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const payroll = await models_1.PayrollModel.findByPk(id, {
                include: [
                    {
                        model: models_1.CompanyModel,
                        as: 'company',
                        attributes: ['id', 'name', 'nit', 'address', 'phone'],
                    },
                ],
            });
            if (!payroll) {
                return null;
            }
            return this.mapToPayrollWithDetails(payroll);
        }
        catch (error) {
            this.logger.error('Error finding payroll by ID', error);
            throw error;
        }
    }
    async findAll() {
        try {
            const payrolls = await models_1.PayrollModel.findAll({
                include: [
                    {
                        model: models_1.CompanyModel,
                        as: 'company',
                        attributes: ['id', 'name', 'nit', 'address', 'phone'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
            return payrolls.map(payroll => this.mapToPayrollWithDetails(payroll));
        }
        catch (error) {
            this.logger.error('Error finding all payrolls', error);
            throw error;
        }
    }
    async findByUserDocument(userDocument) {
        try {
            const payroll = await models_1.PayrollModel.findOne({
                where: { userDocument },
            });
            if (!payroll) {
                return null;
            }
            return this.mapToPayroll(payroll);
        }
        catch (error) {
            this.logger.error('Error finding payroll by user document', error);
            throw error;
        }
    }
    async findActiveByUserDocument(userDocument) {
        try {
            const payroll = await models_1.PayrollModel.findOne({
                where: {
                    userDocument,
                    status: PayrollStatus_1.PayrollStatus.ACTIVO,
                },
            });
            if (!payroll) {
                return null;
            }
            return this.mapToPayroll(payroll);
        }
        catch (error) {
            this.logger.error('Error finding active payroll by user document', error);
            throw error;
        }
    }
    async getAllCompanies() {
        try {
            const companies = await models_1.CompanyModel.findAll({
                order: [['name', 'ASC']],
            });
            return companies.map(company => this.mapToCompany(company));
        }
        catch (error) {
            this.logger.error('Error getting all companies', error);
            throw error;
        }
    }
    async getCompanyById(id) {
        try {
            const company = await models_1.CompanyModel.findByPk(id);
            if (!company) {
                return null;
            }
            return this.mapToCompany(company);
        }
        catch (error) {
            this.logger.error('Error getting company by ID', error);
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await models_1.PayrollModel.destroy({
                where: { id },
            });
            return result > 0;
        }
        catch (error) {
            this.logger.error('Error deleting payroll', error);
            throw error;
        }
    }
    mapToPayroll(payrollModel) {
        return {
            id: payrollModel.id,
            userDocument: payrollModel.userDocument,
            companyId: payrollModel.companyId,
            position: payrollModel.position || undefined,
            status: payrollModel.status,
            createdAt: payrollModel.createdAt,
            updatedAt: payrollModel.updatedAt,
        };
    }
    mapToPayrollWithDetails(payrollModel) {
        const payroll = this.mapToPayroll(payrollModel);
        if (payrollModel.company) {
            return {
                ...payroll,
                company: {
                    id: payrollModel.company.id,
                    name: payrollModel.company.name,
                    nit: payrollModel.company.nit,
                    address: payrollModel.company.address || undefined,
                    phone: payrollModel.company.phone || undefined,
                },
            };
        }
        return payroll;
    }
    mapToCompany(companyModel) {
        return {
            id: companyModel.id,
            name: companyModel.name,
            nit: companyModel.nit,
            address: companyModel.address || undefined,
            phone: companyModel.phone || undefined,
            createdAt: companyModel.createdAt,
            updatedAt: companyModel.updatedAt,
        };
    }
}
exports.PayrollRepository = PayrollRepository;
//# sourceMappingURL=PayrollRepository.js.map