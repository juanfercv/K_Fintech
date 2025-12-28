// Type definitions for api.js
// This file provides type definitions for the JavaScript API module

export interface Tienda {
  idTienda: number;
  fotoTienda: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda: string;
  correo_electronico_tienda: string;
  telefono: string;
}

export interface Cliente {
  idCliente: number;
  // Add other properties as needed
}

export interface TiendaService {
  getAll: () => Promise<Tienda[]>;
  getById: (id: string) => Promise<Tienda>;
  create: (data: Partial<Tienda>) => Promise<Tienda>;
  update: (id: string, data: Partial<Tienda>) => Promise<Tienda>;
  delete: (id: string) => Promise<void>;
}

export interface ClienteService {
  getAll: () => Promise<Cliente[]>;
  getById: (id: string) => Promise<Cliente>;
  create: (data: Partial<Cliente>) => Promise<Cliente>;
  update: (id: string, data: Partial<Cliente>) => Promise<Cliente>;
  delete: (id: string) => Promise<void>;
}

export const tiendaService: TiendaService;
export const clienteService: ClienteService;

const api: {
  tiendaService: TiendaService;
  clienteService: ClienteService;
};

export default api;