import { Model, Sequelize, Association } from 'sequelize';
import { CompanyModel } from './CompanyModel';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';
export declare class PayrollModel extends Model {
    id: number;
    userDocument: string;
    companyId: number;
    position: string | null;
    status: PayrollStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly company?: CompanyModel;
    static associations: {
        company: Association<PayrollModel, CompanyModel>;
    };
}
export declare const initPayrollModel: (sequelize: Sequelize) => typeof PayrollModel;
export declare const associatePayrollModel: () => void;
//# sourceMappingURL=PayrollModel.d.ts.map