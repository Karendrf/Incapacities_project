"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const AuthUserModel_1 = require("../../infrastructure/adapters/persistence/models/AuthUserModel");
const UnauthorizedError_1 = require("../../shared/errors/UnauthorizedError");
const logger_1 = require("../../shared/utils/logger");
const server_config_1 = require("../../infrastructure/config/server.config");
class AuthService {
    constructor() {
        this.logger = new logger_1.Logger('AuthService');
    }
    /**
     * Autenticar usuario y generar token JWT
     */
    async login(loginData) {
        this.logger.info('Login attempt', { username: loginData.username });
        // Buscar usuario
        const user = await AuthUserModel_1.AuthUserModel.findOne({
            where: { username: loginData.username },
        });
        if (!user) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciales inválidas');
        }
        // Verificar contraseña (en este caso simple, sin hash)
        // NOTA: En producción deberías usar bcrypt
        if (user.password !== loginData.password) {
            throw new UnauthorizedError_1.UnauthorizedError('Credenciales inválidas');
        }
        // Generar token JWT - CORREGIDO
        const token = jwt.sign({
            userId: user.id.toString(),
            role: user.role,
            document: user.document,
        }, server_config_1.serverConfig.jwtSecret, {
            algorithm: 'HS256',
        });
        this.logger.info('Login successful', {
            userId: user.id,
            role: user.role
        });
        return {
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                document: user.document,
                name: user.name,
            },
        };
    }
    /**
     * Verificar y decodificar un token
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, server_config_1.serverConfig.jwtSecret);
        }
        catch (error) {
            throw new UnauthorizedError_1.UnauthorizedError('Token inválido o expirado');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map