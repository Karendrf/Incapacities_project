export interface Company {
  id: number;
  name: string;
  nit: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
