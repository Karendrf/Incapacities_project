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
                notEmpty: true, //No permite cadenas vacías
            },
        },
        nit: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true, //No permite cadenas vacías
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
        tableName: 'companies', //Nombre de la tabla en la base de datos
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['nit'], //Índice único en el campo NIT
            },
            {
                unique: true,
                fields: ['name'], //Índice único en el campo nombre
            },
        ],
    });
    return CompanyModel;
};
exports.initCompanyModel = initCompanyModel;
//# sourceMappingURL=CompanyModel.js.map