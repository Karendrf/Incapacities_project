/**
 * Modelo de usuario básico
 */
export interface User {
  /**Documento del usuario*/
  document: string;
  /**Nombre del usuario*/
  name: string;
  /**Apellido del usuario*/
  lastName: string;
  /**Correo electrónico del usuario*/
  email: string;
}
