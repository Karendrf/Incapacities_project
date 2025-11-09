import { Model, DataTypes, Sequelize } from 'sequelize';

export class AuthUserModel extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public role!: 'administrador' | 'empleado';
  public document!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initAuthUserModel = (sequelize: Sequelize): typeof AuthUserModel => {
  AuthUserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('administrador', 'empleado'),
        allowNull: false,
      },
      document: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'auth_users',
      timestamps: true,
      underscored: true,
    }
  );

  return AuthUserModel;
};