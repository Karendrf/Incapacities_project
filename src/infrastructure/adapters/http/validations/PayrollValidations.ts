import { body, param } from 'express-validator';
import { ValidateRequest } from '../middlewares/validateRequest';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';

const VALIDATION_MESSAGES = {
  USER_ID_REQUIRED: 'El ID del usuario es requerido',
  USER_ID_INVALID: 'El ID del usuario debe ser un número positivo',
  COMPANY_ID_REQUIRED: 'El ID de la empresa es requerido',
  COMPANY_ID_INVALID: 'El ID de la empresa debe ser un número positivo',
  STATUS_REQUIRED: 'El estado es requerido',
  STATUS_INVALID: `El estado debe ser: ${Object.values(PayrollStatus).join(' o ')}`,
  ID_INVALID: 'ID inválido. Debe ser un número positivo',
} as const;
export class PayrollValidations {
  private static userIdValidation() {
    return body('userId')
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.USER_ID_REQUIRED)
      .isNumeric()
      .withMessage(VALIDATION_MESSAGES.USER_ID_INVALID)
      .toInt()
      .custom((value: number) => value > 0)
      .withMessage(VALIDATION_MESSAGES.USER_ID_INVALID);
  }
  private static userIdParamValidation() {
    return param('userId')
      .isNumeric()
      .withMessage(VALIDATION_MESSAGES.USER_ID_INVALID)
      .toInt()
      .custom((value: number) => value > 0)
      .withMessage(VALIDATION_MESSAGES.USER_ID_INVALID);
  }
  private static companyIdValidation(optional: boolean = false) {
    const validation = body('companyId');
    if (!optional) {
      validation
        .notEmpty()
        .withMessage(VALIDATION_MESSAGES.COMPANY_ID_REQUIRED);
    } else {
      validation.optional();
    }
    return validation
      .isInt({ min: 1 })
      .withMessage(VALIDATION_MESSAGES.COMPANY_ID_INVALID);
  }
  private static statusValidation(optional: boolean = false) {
    const validation = body('status');
    if (!optional) {
      validation
        .notEmpty()
        .withMessage(VALIDATION_MESSAGES.STATUS_REQUIRED);
    } else {
      validation.optional();
    }
    return validation
      .isIn(Object.values(PayrollStatus))
      .withMessage(VALIDATION_MESSAGES.STATUS_INVALID);
  }
  private static idParamValidation() {
    return param('id')
      .isInt({ min: 1 })
      .withMessage(VALIDATION_MESSAGES.ID_INVALID);
  }
  public static create() {
    return ValidateRequest.validate([
      this.userIdValidation(),
      this.companyIdValidation(false),
      this.statusValidation(false),
    ]);
  }
  public static update() {
    return ValidateRequest.validate([
      this.idParamValidation(),
      this.companyIdValidation(true),
      this.statusValidation(true),
    ]);
  }
  public static getById() {
    return ValidateRequest.validate([
      this.idParamValidation(),
    ]);
  }
  public static getByUserId() {
    return ValidateRequest.validate([
      this.userIdParamValidation(),
    ]);
  }
  public static delete() {
    return ValidateRequest.validate([
      this.idParamValidation(),
    ]);
  }
}