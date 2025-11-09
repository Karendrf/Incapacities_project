"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validateRequest_1 = require("../middlewares/validateRequest");
const authMiddleware_1 = require("../middlewares/authMiddleware");
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new AuthController_1.AuthController();
        this.configureRoutes();
    }
    configureRoutes() {
        // Login - NO requiere autenticación
        this.router.post('/login', validateRequest_1.ValidateRequest.validate([
            (0, express_validator_1.body)('username')
                .notEmpty()
                .withMessage('El nombre de usuario es requerido'),
            (0, express_validator_1.body)('password')
                .notEmpty()
                .withMessage('La contraseña es requerida'),
        ]), this.authController.login);
        // Obtener información del usuario actual - SÍ requiere autenticación
        this.router.get('/me', authMiddleware_1.AuthMiddleware.authenticate, this.authController.me);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=AuthRoutes.js.map