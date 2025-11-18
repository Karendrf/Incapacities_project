import { PayrollStatus } from '../../domain/enums/PayrollStatus';
import { ValidationError } from '../errors/ValidationError';

/**
 * Utilidad de validación de datos
 * Proporciona métodos estáticos para validar y sanitizar datos de entrada
 * en toda la aplicación asegurando que los datos cumplan con las reglas de negocio
 * antes de ser procesados
 */
export class Validator {
  //Valida que un documento tenga formato correcto (6-15 dígitos numéricos)
  public static isValidDocument(document: string): boolean {
    return /^[0-9]{6,15}$/.test(document);
  }

  //Valida que un estado sea uno de los valores permitidos del enum PayrollStatus
  public static isValidStatus(status: string): boolean {
    return Object.values(PayrollStatus).includes(status as PayrollStatus);
  }

  //Valida que un valor sea un número entero positivo
  public static isPositiveInteger(value: any): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  }

  //Valida que todos los campos requeridos estén presentes en el objeto
  public static validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Campos requeridos faltantes: ${missingFields.join(', ')}`
      );
    }
  }

  //Limpia y normaliza una cadena de texto 
  public static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }
}