"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCompanyModel = exports.CompanyModel = void 0;
const sequelize_1 = require("sequelize");
class CompanyModel extends sequelize_1.Model {
}
exports.CompanyModel = CompanyModel;
const initCompanyModel = (sequelize) => {
    CompanyModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        nit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        address: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
        phone: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'companies',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['nit'],
            },
            {
                unique: true,
                fields: ['name'],
            },
        ],
    });
    return CompanyModel;
};
exports.initCompanyModel = initCompanyModel;
//# sourceMappingURL=CompanyModel.js.map