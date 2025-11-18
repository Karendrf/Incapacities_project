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
                notEmpty: true, //No permite cadenas vacías
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
                isIn: [Object.values(PayrollStatus_1.PayrollStatus)], // Valida que sea un valor del enum
            },
        },
    }, {
        sequelize,
        tableName: 'payrolls',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['user_document'], //Índice en documento de usuario
            },
            {
                fields: ['company_id'], //Índice en ID de empresa
            },
            {
                fields: ['status'], //Índice en estado
            },
            {
                fields: ['user_document', 'status'], //Índice compuesto para búsquedas combinadas
            },
        ],
    });
    return PayrollModel;
};
exports.initPayrollModel = initPayrollModel;
const associatePayrollModel = () => {
    PayrollModel.belongsTo(CompanyModel_1.CompanyModel, {
        foreignKey: 'companyId', // Llave foránea en PayrollModel
        as: 'company',
    });
    CompanyModel_1.CompanyModel.hasMany(PayrollModel, {
        foreignKey: 'companyId', // Llave foránea en PayrollModel
        as: 'payrolls',
    });
};
exports.associatePayrollModel = associatePayrollModel;
//# sourceMappingURL=PayrollModel.js.map