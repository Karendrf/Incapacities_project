"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const PayrollStatus_1 = require("../../domain/enums/PayrollStatus");
const ValidationError_1 = require("../errors/ValidationError");
class Validator {
    static isValidDocument(document) {
        return /^[0-9]{6,15}$/.test(document);
    }
    static isValidStatus(status) {
        return Object.values(PayrollStatus_1.PayrollStatus).includes(status);
    }
    static isPositiveInteger(value) {
        const num = Number(value);
        return Number.isInteger(num) && num > 0;
    }
    static validateRequiredFields(data, requiredFields) {
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new ValidationError_1.ValidationError(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
        }
    }
    static sanitizeString(str) {
        return str.trim().replace(/\s+/g, ' ');
    }
}
exports.Validator = Validator;
//# sourceMappingURL=validator.js.map