import { body, param } from 'express-validator';
import { ValidateRequest } from '../middlewares/validateRequest';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';


//Constantes de validación reutilizables
const VALIDATION_PATTERNS = {
  DOCUMENT: /^[0-9]{6,15}$/,
} as const;

const VALIDATION_MESSAGES = {
  DOCUMENT_REQUIRED: 'El documento del usuario es requerido',
  DOCUMENT_INVALID: 'Formato de documento inválido. Debe contener entre 6 y 15 dígitos',
  COMPANY_ID_REQUIRED: 'El ID de la empresa es requerido',
  COMPANY_ID_INVALID: 'El ID de la empresa debe ser un número positivo',
  POSITION_INVALID: 'El cargo debe ser un texto',
  POSITION_TOO_LONG: 'El cargo no puede exceder 100 caracteres',
  STATUS_REQUIRED: 'El estado es requerido',
  STATUS_INVALID: `El estado debe ser: ${Object.values(PayrollStatus).join(' o ')}`,
  ID_INVALID: 'ID inválido. Debe ser un número positivo',
} as const;

//Validaciones centralizadas para el módulo de nómina
export class PayrollValidations {
  //Validación común para documento de usuario
  private static documentValidation() {
    return body('userDocument')
      .trim()
      .notEmpty()
      .withMessage(VALIDATION_MESSAGES.DOCUMENT_REQUIRED)
      .matches(VALIDATION_PATTERNS.DOCUMENT)
      .withMessage(VALIDATION_MESSAGES.DOCUMENT_INVALID);
  }
 
  //Validación común para parámetro de documento
  private static documentParamValidation() {
    return param('document')
      .trim()
      .matches(VALIDATION_PATTERNS.DOCUMENT)
      .withMessage(VALIDATION_MESSAGES.DOCUMENT_INVALID);
  }

  //Validación común para ID de empresa 
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

  //Validación común para cargo
  private static positionValidation() {
    return body('position')
      .optional()
      .trim()
      .isString()
      .withMessage(VALIDATION_MESSAGES.POSITION_INVALID)
      .isLength({ max: 100 })
      .withMessage(VALIDATION_MESSAGES.POSITION_TOO_LONG);
  }

  //Validación común para estado
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

  //Validación común para parámetro ID
  private static idParamValidation() {
    return param('id')
      .isInt({ min: 1 })
      .withMessage(VALIDATION_MESSAGES.ID_INVALID);
  }

  //Validaciones para crear nómina
  public static create() {
    return ValidateRequest.validate([
      this.documentValidation(),
      this.companyIdValidation(false),
      this.positionValidation(),
      this.statusValidation(false),
    ]);
  }

  //Validaciones para actualizar nómina
  public static update() {
    return ValidateRequest.validate([
      this.idParamValidation(),
      this.companyIdValidation(true),
      this.positionValidation(),
      this.statusValidation(true),
    ]);
  }

  //Validaciones para obtener nómina por ID
  public static getById() {
    return ValidateRequest.validate([
      this.idParamValidation(),
    ]);
  }

  //Validaciones para obtener nómina por documento
  public static getByDocument() {
    return ValidateRequest.validate([
      this.documentParamValidation(),
    ]);
  }

  //Validaciones para eliminar nómina
  public static delete() {
    return ValidateRequest.validate([
      this.idParamValidation(),
    ]);
  }
}