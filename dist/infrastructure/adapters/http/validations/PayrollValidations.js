"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollValidations = void 0;
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middlewares/validateRequest");
const PayrollStatus_1 = require("../../../../domain/enums/PayrollStatus");
const VALIDATION_PATTERNS = {
    DOCUMENT: /^[0-9]{6,15}$/,
};
const VALIDATION_MESSAGES = {
    DOCUMENT_REQUIRED: 'El documento del usuario es requerido',
    DOCUMENT_INVALID: 'Formato de documento inválido. Debe contener entre 6 y 15 dígitos',
    COMPANY_ID_REQUIRED: 'El ID de la empresa es requerido',
    COMPANY_ID_INVALID: 'El ID de la empresa debe ser un número positivo',
    POSITION_INVALID: 'El cargo debe ser un texto',
    POSITION_TOO_LONG: 'El cargo no puede exceder 100 caracteres',
    STATUS_REQUIRED: 'El estado es requerido',
    STATUS_INVALID: `El estado debe ser: ${Object.values(PayrollStatus_1.PayrollStatus).join(' o ')}`,
    ID_INVALID: 'ID inválido. Debe ser un número positivo',
};
class PayrollValidations {
    static documentValidation() {
        return (0, express_validator_1.body)('userDocument')
            .trim()
            .notEmpty()
            .withMessage(VALIDATION_MESSAGES.DOCUMENT_REQUIRED)
            .matches(VALIDATION_PATTERNS.DOCUMENT)
            .withMessage(VALIDATION_MESSAGES.DOCUMENT_INVALID);
    }
    static documentParamValidation() {
        return (0, express_validator_1.param)('document')
            .trim()
            .matches(VALIDATION_PATTERNS.DOCUMENT)
            .withMessage(VALIDATION_MESSAGES.DOCUMENT_INVALID);
    }
    static companyIdValidation(optional = false) {
        const validation = (0, express_validator_1.body)('companyId');
        if (!optional) {
            validation
                .notEmpty()
                .withMessage(VALIDATION_MESSAGES.COMPANY_ID_REQUIRED);
        }
        else {
            validation.optional();
        }
        return validation
            .isInt({ min: 1 })
            .withMessage(VALIDATION_MESSAGES.COMPANY_ID_INVALID);
    }
    static positionValidation() {
        return (0, express_validator_1.body)('position')
            .optional()
            .trim()
            .isString()
            .withMessage(VALIDATION_MESSAGES.POSITION_INVALID)
            .isLength({ max: 100 })
            .withMessage(VALIDATION_MESSAGES.POSITION_TOO_LONG);
    }
    static statusValidation(optional = false) {
        const validation = (0, express_validator_1.body)('status');
        if (!optional) {
            validation
                .notEmpty()
                .withMessage(VALIDATION_MESSAGES.STATUS_REQUIRED);
        }
        else {
            validation.optional();
        }
        return validation
            .isIn(Object.values(PayrollStatus_1.PayrollStatus))
            .withMessage(VALIDATION_MESSAGES.STATUS_INVALID);
    }
    static idParamValidation() {
        return (0, express_validator_1.param)('id')
            .isInt({ min: 1 })
            .withMessage(VALIDATION_MESSAGES.ID_INVALID);
    }
    static create() {
        return validateRequest_1.ValidateRequest.validate([
            this.documentValidation(),
            this.companyIdValidation(false),
            this.positionValidation(),
            this.statusValidation(false),
        ]);
    }
    static update() {
        return validateRequest_1.ValidateRequest.validate([
            this.idParamValidation(),
            this.companyIdValidation(true),
            this.positionValidation(),
            this.statusValidation(true),
        ]);
    }
    static getById() {
        return validateRequest_1.ValidateRequest.validate([
            this.idParamValidation(),
        ]);
    }
    static getByDocument() {
        return validateRequest_1.ValidateRequest.validate([
            this.documentParamValidation(),
        ]);
    }
    static delete() {
        return validateRequest_1.ValidateRequest.validate([
            this.idParamValidation(),
        ]);
    }
}
exports.PayrollValidations = PayrollValidations;
//# sourceMappingURL=PayrollValidations.js.map