"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.associatePayrollModel = exports.initPayrollModel = exports.PayrollModel = void 0;
const sequelize_1 = require("sequelize");
const CompanyModel_1 = require("./CompanyModel");
const PayrollStatus_1 = require("../../../../domain/enums/PayrollStatus");
class PayrollModel extends sequelize_1.Model {
}
exports.PayrollModel = PayrollModel;
const initPayrollModel = (sequelize) => {
    PayrollModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userDocument: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            field: 'user_document',
            validate: {
                notEmpty: true,
                is: /^[0-9]{6,15}$/,
            },
        },
        companyId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            field: 'company_id',
            references: {
                model: 'companies',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        position: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PayrollStatus_1.PayrollStatus)),
            allowNull: false,
            validate: {
                isIn: [Object.values(PayrollStatus_1.PayrollStatus)],
            },
        },
    }, {
        sequelize,
        tableName: 'payrolls',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_document'],
            },
            {
                fields: ['company_id'],
            },
            {
                fields: ['status'],
            },
            {
                fields: ['user_document', 'status'],
            },
        ],
    });
    return PayrollModel;
};
exports.initPayrollModel = initPayrollModel;
// Define associations
const associatePayrollModel = () => {
    PayrollModel.belongsTo(CompanyModel_1.CompanyModel, {
        foreignKey: 'companyId',
        as: 'company',
    });
    CompanyModel_1.CompanyModel.hasMany(PayrollModel, {
        foreignKey: 'companyId',
        as: 'payrolls',
    });
};
exports.associatePayrollModel = associatePayrollModel;
//# sourceMappingURL=PayrollModel.js.map