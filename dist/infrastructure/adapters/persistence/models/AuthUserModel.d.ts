import { Model, Sequelize } from 'sequelize';
export declare class AuthUserModel extends Model {
    id: number;
    username: string;
    password: string;
    role: 'administrador' | 'empleado';
    document: string;
    name: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const initAuthUserModel: (sequelize: Sequelize) => typeof AuthUserModel;
//# sourceMappingURL=AuthUserModel.d.ts.map