import { Model, DataTypes, Sequelize } from 'sequelize';

/**
 * Modelo de Empresa
 * Representa una empresa en el sistema con su información básica de registro.
 * Cada empresa se identifica de manera única por su nombre y NIT
 */
export class CompanyModel extends Model {
  //Identificador único de la empresa
  public id!: number;
  //Nombre o razón social de la empresa (único en el sistema)
  public name!: string;
  //Número de Identificación Tributaria (único en el sistema)
  public nit!: string;
  //Dirección física de la empresa (opcional)
  public address!: string | null;
  //Número de teléfono de contacto (opcional)
  public phone!: string | null;
  //Fecha de creación del registro (automático)
  public readonly createdAt!: Date;
  //Fecha de última actualización del registro (automático)
  public readonly updatedAt!: Date;
}

/**
 * Inicializa el modelo de empresa
 * Configura la estructura de la tabla companies en la base de datos,
 * definiendo tipos de datos, validaciones, restricciones e índices para cada campo
 */
export const initCompanyModel = (sequelize: Sequelize): typeof CompanyModel => {
  CompanyModel.init(
    {
      //ID auto-incremental como clave primaria
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      //Nombre de la empresa, único y obligatorio, máximo 255 caracteres
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true, //No permite cadenas vacías
        },
      },
      //NIT de la empresa, único y obligatorio, máximo 50 caracteres
      nit: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true, //No permite cadenas vacías
        },
      },
      //Dirección física de la empresa (opcional), máximo 255 caracteres
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      //Teléfono de contacto (opcional), máximo 50 caracteres
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
      // Índices para mejorar el rendimiento de búsquedas por NIT y nombre
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