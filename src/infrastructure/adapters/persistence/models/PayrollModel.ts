import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import { CompanyModel } from './CompanyModel';
import { PayrollStatus } from '../../../../domain/enums/PayrollStatus';

//Modelo de Nómina
export class PayrollModel extends Model {
  //Identificador único del registro de nómina
  public id!: number;
  //Documento de identidad del empleado
  public userDocument!: string;
  //ID de la empresa a la que pertenece el empleado
  public companyId!: number;
  //Cargo o posición del empleado en la empresa (opcional)
  public position!: string | null; 
  //Estado actual del registro en la nómina
  public status!: PayrollStatus;
  //Fecha de creación del registro (automático)
  public readonly createdAt!: Date;
  //Fecha de última actualización del registro (automático)
  public readonly updatedAt!: Date;
  //Empresa asociada a este registro de nómina (cargada opcionalmente)
  public readonly company?: CompanyModel;
  //Definición de asociaciones del modelo
  public static associations: {
    company: Association<PayrollModel, CompanyModel>;
  };
}

//Inicializa el modelo de nómina
export const initPayrollModel = (sequelize: Sequelize): typeof PayrollModel => {
  PayrollModel.init(
    {
      //ID auto-incremental como clave primaria
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      //Documento de identidad del empleado, obligatorio
      userDocument: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'user_document',
        validate: {
          notEmpty: true, //No permite cadenas vacías
          is: /^[0-9]{6,15}$/,
        },
      },
      //ID de la empresa (llave foránea), obligatorio
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
          isIn: [Object.values(PayrollStatus)], // Valida que sea un valor del enum
        },
      },
    },
    {
      sequelize,
      tableName: 'payrolls',
      timestamps: true,
      underscored: true,
      //Índices para mejorar el rendimiento de consultas frecuentes
      indexes: [
        {
          fields: ['user_document'], //Índice en documento de usuario
        },
        {
          fields: ['company_id'], //Índice en ID de empresa
        },
        {
          fields: ['status'], //Índice en estado
        },
        {
          fields: ['user_document', 'status'], //Índice compuesto para búsquedas combinadas
        },
      ],
    }
  );

  return PayrollModel;
};

//Establece las asociaciones del modelo de nómina
export const associatePayrollModel = (): void => {
  // Un registro de nómina pertenece a una empresa
  PayrollModel.belongsTo(CompanyModel, {
    foreignKey: 'companyId', // Llave foránea en PayrollModel
    as: 'company',
  });
  CompanyModel.hasMany(PayrollModel, {
    foreignKey: 'companyId', // Llave foránea en PayrollModel
    as: 'payrolls',
  });
};