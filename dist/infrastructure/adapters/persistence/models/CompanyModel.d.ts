import { Model, Sequelize } from 'sequelize';
export declare class CompanyModel extends Model {
    id: number;
    name: string;
    nit: string;
    address: string | null;
    phone: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const initCompanyModel: (sequelize: Sequelize) => typeof CompanyModel;
//# sourceMappingURL=CompanyModel.d.ts.map