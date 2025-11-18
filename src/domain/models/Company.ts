/**
 * Modelo de una empresa dentro del sistema.
 * Representa la información básica registrada en la base de datos.
 */
export interface Company {
  /** ID único de la empresa */
  id: number;
  /** Nombre de la empresa */
  name: string;
  /** NIT o identificador tributario */
  nit: string;
  /** Dirección de la empresa (opcional) */
  address?: string;
  /** Teléfono de contacto (opcional) */
  phone?: string;
  /** Fecha de creación del registro */
  createdAt: Date;
  /** Fecha de la última actualización del registro */
  updatedAt: Date;
}
