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
        field: 'id_company',
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true, //No permite cadenas vacías
        },
      },
      nit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true, //No permite cadenas vacías
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
      tableName: 'companies', //Nombre de la tabla en la base de datos
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['nit'], //Índice único en el campo NIT
        },
        {
          unique: true,
          fields: ['name'], //Índice único en el campo nombre
        },
      ],
    }
  );
  return CompanyModel;
};