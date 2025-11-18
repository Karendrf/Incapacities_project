/**
 * Información del usuario del sistema.
 * Contiene credenciales y datos básicos del perfil.
 */
export interface AuthUser {
  /** ID único del usuario */
  id: number;
  /** Nombre de usuario para iniciar sesión */
  username: string;
  /** Contraseña en texto plano o cifrada */
  password: string;
  /** Rol del usuario dentro del sistema */
  role: 'administrador' | 'empleado';
  /** Documento de identidad del usuario */
  document: string;
  /** Nombre completo del usuario */
  name: string;
}

/**
 * Datos requeridos para realizar un inicio de sesión.
 */
export interface LoginRequest {
  /** Nombre de usuario */
  username: string;
  /** Contraseña del usuario */
  password: string;
}

/**
 * Respuesta enviada después de un login exitoso.
 */
export interface LoginResponse {
  /** Indica si el inicio de sesión fue exitoso */
  success: boolean;
  /** Token JWT generado para el usuario */
  token: string;
  /** Información del usuario autenticado */
  user: {
    /** ID del usuario */
    id: number;
    /** Nombre de usuario */
    username: string;
    /** Rol del usuario en el sistema */
    role: string;
    /** Documento de identidad */
    document: string;
    /** Nombre completo */
    name: string;
  };
}
