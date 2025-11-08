import { Model, DataTypes, Sequelize } from 'sequelize';

export class CompanyModel extends Model {
  public id!: number;
  public name!: string;
  public nit!: string;
  public address!: string | null;
  public phone!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initCompanyModel = (sequelize: Sequelize): typeof CompanyModel => {
  CompanyModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      nit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'companies',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['nit'],
        },
        {
          unique: true,
          fields: ['name'],
        },
      ],
    }
  );

  return CompanyModel;
};
