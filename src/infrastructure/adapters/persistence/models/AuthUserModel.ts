import { Model, DataTypes, Sequelize } from 'sequelize';

/**
 * Modelo de Usuario de Autenticación
 * Representa un usuario en el sistema con sus credenciales y datos básicos.
 * Cada usuario puede tener rol de administrador o empleado.
 */
export class AuthUserModel extends Model {
  //Identificador único del usuario
  public id!: number;
  
  //Nombre de usuario para iniciar sesión (único en el sistema)
  public username!: string;
  
  //Contraseña encriptada del usuario
  public password!: string;
  
  //Rol del usuario en el sistema
  public role!: 'administrador' | 'empleado';
  
  //Número de documento de identidad (único en el sistema)
  public document!: string;
  
  //Nombre completo del usuario
  public name!: string;
  
  //Fecha de creación del registro (automático)
  public readonly createdAt!: Date;
  
  //Fecha de última actualización del registro (automático)
  public readonly updatedAt!: Date;
}

/**
 * Inicializa el modelo de usuario de autenticación
 * Configura la estructura de la tabla auth_users en la base de datos,
 * definiendo tipos de datos, validaciones y restricciones para cada campo.
 */
export const initAuthUserModel = (sequelize: Sequelize): typeof AuthUserModel => {
  AuthUserModel.init(
    {
      // ID auto-incremental como clave primaria
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Nombre de usuario único, máximo 50 caracteres
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Contraseña encriptada, máximo 255 caracteres
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // Rol del usuario: solo permite 'administrador' o 'empleado'
      role: {
        type: DataTypes.ENUM('administrador', 'empleado'),
        allowNull: false,
      },
      // Documento de identidad único, máximo 50 caracteres
      document: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      // Nombre completo del usuario, máximo 255 caracteres
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