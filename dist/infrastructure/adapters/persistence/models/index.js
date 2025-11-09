"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserModel = exports.PayrollModel = exports.CompanyModel = exports.initModels = void 0;
const CompanyModel_1 = require("./CompanyModel");
Object.defineProperty(exports, "CompanyModel", { enumerable: true, get: function () { return CompanyModel_1.CompanyModel; } });
const PayrollModel_1 = require("./PayrollModel");
Object.defineProperty(exports, "PayrollModel", { enumerable: true, get: function () { return PayrollModel_1.PayrollModel; } });
const AuthUserModel_1 = require("./AuthUserModel");
Object.defineProperty(exports, "AuthUserModel", { enumerable: true, get: function () { return AuthUserModel_1.AuthUserModel; } });
const initModels = (sequelize) => {
    // Initialize models
    (0, CompanyModel_1.initCompanyModel)(sequelize);
    (0, PayrollModel_1.initPayrollModel)(sequelize);
    (0, AuthUserModel_1.initAuthUserModel)(sequelize);
    // Setup associations
    (0, PayrollModel_1.associatePayrollModel)();
};
exports.initModels = initModels;
//# sourceMappingURL=index.js.map