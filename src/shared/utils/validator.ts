import { PayrollStatus } from '../../domain/enums/PayrollStatus';
import { ValidationError } from '../errors/ValidationError';

export class Validator {
  public static isValidDocument(document: string): boolean {
    return /^[0-9]{6,15}$/.test(document);
  }

  public static isValidStatus(status: string): boolean {
    return Object.values(PayrollStatus).includes(status as PayrollStatus);
  }

  public static isPositiveInteger(value: any): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num > 0;
  }

  public static validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(
        `Campos requeridos faltantes: ${missingFields.join(', ')}`
      );
    }
  }

  public static sanitizeString(str: string): string {
    return str.trim().replace(/\s+/g, ' ');
  }
}