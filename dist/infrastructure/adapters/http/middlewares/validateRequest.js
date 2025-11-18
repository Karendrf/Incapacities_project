"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRequest = void 0;
const express_validator_1 = require("express-validator");
const ValidationError_1 = require("../../../../shared/errors/ValidationError");
class ValidateRequest {
    static validate(validations) {
        return async (req, _res, next) => {
            await Promise.all(validations.map(validation => validation.run(req)));
            const errors = (0, express_validator_1.validationResult)(req);
            if (errors.isEmpty()) {
                return next();
            }
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            next(new ValidationError_1.ValidationError(errorMessages));
        };
    }
}
exports.ValidateRequest = ValidateRequest;
//# sourceMappingURL=validateRequest.js.map