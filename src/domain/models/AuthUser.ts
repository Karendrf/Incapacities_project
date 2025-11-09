export interface AuthUser {
  id: number;
  username: string;
  password: string;
  role: 'administrador' | 'empleado';
  document: string;
  name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
    document: string;
    name: string;
  };
}