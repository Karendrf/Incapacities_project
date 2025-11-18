import { Request, Response, NextFunction } from 'express';
import { IPayrollService } from '../../../../application/ports/in/IPayrollService';
import { CreatePayrollDto } from '../../../../application/dto/CreatePayrollDto';
import { UpdatePayrollDto } from '../../../../application/dto/UpdatePayrollDto';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';
import { Logger } from '../../../../shared/utils/logger';

export class PayrollController {
  private readonly logger: Logger;

  constructor(private readonly payrollService: IPayrollService) {
    this.logger = new Logger('PayrollController');
  }

  /**
   * Crea una nueva nómina
   * Extrae los datos del cuerpo de la petición y llama al servicio para crear la nómina.
   */
  public createPayroll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('POST /createPayroll - Creating new payroll', {
        userDocument: req.body.userDocument,
      });

      const createPayrollDto: CreatePayrollDto = {
        userDocument: req.body.userDocument,
        companyId: parseInt(req.body.companyId, 10),
        position: req.body.position,
        status: req.body.status as PayrollStatus,
      };

      const payroll = await this.payrollService.createPayroll(createPayrollDto);

      res.status(201).json({
        success: true,
        message: 'Nómina creada exitosamente',
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualiza una nómina existente por ID
   * Solo actualiza los campos enviados por el usuario.
   */
  public updatePayroll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      this.logger.info(`PUT /updatePayroll/${id} - Updating payroll`);

      const updatePayrollDto: UpdatePayrollDto = {};

      if (req.body.companyId !== undefined) {
        updatePayrollDto.companyId = parseInt(req.body.companyId, 10);
      }
      if (req.body.position !== undefined) {
        updatePayrollDto.position = req.body.position;
      }
      if (req.body.status !== undefined) {
        updatePayrollDto.status = req.body.status as PayrollStatus;
      }

      const payroll = await this.payrollService.updatePayroll(id, updatePayrollDto);

      res.status(200).json({
        success: true,
        message: 'Nómina actualizada exitosamente',
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene una nómina por su ID
   */
  public getPayrollById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      this.logger.info(`GET /getPayrollById/${id} - Getting payroll by ID`);

      const payroll = await this.payrollService.getPayrollById(id);

      res.status(200).json({
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene todas las nóminas del sistema
   */
  public getAllPayrolls = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('GET /getAllPayrolls - Getting all payrolls');

      const payrolls = await this.payrollService.getAllPayrolls();

      res.status(200).json({
        success: true,
        count: payrolls.length,
        data: payrolls,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene una nómina por el documento del usuario
   */
  public getPayrollByUserDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userDocument = req.params.document;
      this.logger.info(
        `GET /getPayrollByDocument/${userDocument} - Getting payroll by user document`
      );

      const payroll = await this.payrollService.getPayrollByUserDocument(userDocument);

      res.status(200).json({
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene la nómina activa de un usuario por documento
   */
  public getActivePayrollByUserDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userDocument = req.params.document;
      this.logger.info(
        `GET /getActivePayrollByDocument/${userDocument} - Getting active payroll by user document`
      );

      const payroll = await this.payrollService.getActivePayrollByUserDocument(
        userDocument
      );

      res.status(200).json({
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtiene todas las empresas registradas
   */
  public getAllCompanies = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('GET /companies - Getting all companies');

      const companies = await this.payrollService.getAllCompanies();

      res.status(200).json({
        success: true,
        count: companies.length,
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Elimina una nómina por ID
   */
  public deletePayroll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      this.logger.info(`DELETE /deletePayroll/${id} - Deleting payroll`);

      await this.payrollService.deletePayroll(id);

      res.status(200).json({
        success: true,
        message: 'Nómina eliminada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };
}
