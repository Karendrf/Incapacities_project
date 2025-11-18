import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import { CompanyModel } from './CompanyModel';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';
export class PayrollModel extends Model {
  public id!: number;
  public userId!: number;
  public companyId!: number;
  public status!: PayrollStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly company?: CompanyModel;
  public static associations: {
    company: Association<PayrollModel, CompanyModel>;
  };
}
export const initPayrollModel = (sequelize: Sequelize): typeof PayrollModel => {
  PayrollModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'id_payroll',
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_user',
        references: {
          model: 'users',
          key: 'id_user',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_company',
        references: {
          model: 'companies',
          key: 'id_company',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PayrollStatus)),
        allowNull: false,
        validate: {
          isIn: [Object.values(PayrollStatus)],
        },
      },
    },
    {
      sequelize,
      tableName: 'payrolls',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['id_user'],
        },
        {
          fields: ['id_company'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['id_user', 'status'],
        },
      ],
    }
  );
  return PayrollModel;
};
export const associatePayrollModel = (): void => {
  PayrollModel.belongsTo(CompanyModel, {
    foreignKey: 'companyId', // Llave foránea en PayrollModel
    as: 'company',
  });
  CompanyModel.hasMany(PayrollModel, {
    foreignKey: 'companyId', // Llave foránea en PayrollModel
    as: 'payrolls',
  });
};