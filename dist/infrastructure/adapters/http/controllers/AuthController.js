"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../../../../application/services/AuthService");
const logger_1 = require("../../../../shared/utils/logger");
class AuthController {
    constructor() {
        /**
         * Endpoint de login
         */
        this.login = async (req, res, next) => {
            try {
                this.logger.info('POST /login - User attempting to login');
                const { username, password } = req.body;
                const result = await this.authService.login({ username, password });
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        /**
         * Endpoint para obtener información del usuario actual
         */
        this.me = async (req, res, next) => {
            try {
                // El usuario ya está en req.user por el middleware de autenticación
                res.status(200).json({
                    success: true,
                    user: req.user,
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.logger = new logger_1.Logger('AuthController');
        this.authService = new AuthService_1.AuthService();
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map