"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAuthUserModel = exports.AuthUserModel = void 0;
const sequelize_1 = require("sequelize");
class AuthUserModel extends sequelize_1.Model {
}
exports.AuthUserModel = AuthUserModel;
const initAuthUserModel = (sequelize) => {
    AuthUserModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM('administrador', 'empleado'),
            allowNull: false,
        },
        document: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'auth_users',
        timestamps: true,
        underscored: true,
    });
    return AuthUserModel;
};
exports.initAuthUserModel = initAuthUserModel;
//# sourceMappingURL=AuthUserModel.js.map