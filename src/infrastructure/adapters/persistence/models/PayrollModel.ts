import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import { CompanyModel } from './CompanyModel';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';

export class PayrollModel extends Model {
  public id!: number;
  public userDocument!: string;
  public companyId!: number;
  public position!: string | null;
  public status!: PayrollStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
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
      },
      userDocument: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'user_document',
        validate: {
          notEmpty: true,
          is: /^[0-9]{6,15}$/,
        },
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'company_id',
        references: {
          model: 'companies',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      position: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
          fields: ['user_document'],
        },
        {
          fields: ['company_id'],
        },
        {
          fields: ['status'],
        },
        {
          fields: ['user_document', 'status'],
        },
      ],
    }
  );

  return PayrollModel;
};

// Define associations
export const associatePayrollModel = (): void => {
  PayrollModel.belongsTo(CompanyModel, {
    foreignKey: 'companyId',
    as: 'company',
  });

  CompanyModel.hasMany(PayrollModel, {
    foreignKey: 'companyId',
    as: 'payrolls',
  });
};