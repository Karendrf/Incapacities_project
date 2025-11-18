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
  public createPayroll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.logger.info('POST /createPayroll - Creating new payroll', {
        userId: req.body.userId,
      });
      const createPayrollDto: CreatePayrollDto = {
        userId: parseInt(req.body.userId, 10),
        companyId: parseInt(req.body.companyId, 10),
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
  public getPayrollByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      this.logger.info(
        `GET /getPayrollByUserId/${userId} - Getting payroll by user ID`
      );
      const payroll = await this.payrollService.getPayrollByUserId(userId);
      res.status(200).json({
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };
  public getActivePayrollByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      this.logger.info(
        `GET /getActivePayrollByUserId/${userId} - Getting active payroll by user ID`
      );
      const payroll = await this.payrollService.getActivePayrollByUserId(
        userId
      );
      res.status(200).json({
        success: true,
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  };
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
