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

export interface MetodoPago {
  id_forma_pago: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  crearFormaPago?: string;
  actualizarFormaPago?: string;
}

export interface MetodoPagoService {
  getAll: () => Promise<MetodoPago[]>;
  getActive: () => Promise<MetodoPago[]>;
  getById: (id: string) => Promise<MetodoPago>;
  create: (data: Partial<MetodoPago>) => Promise<MetodoPago>;
  update: (id: string, data: Partial<MetodoPago>) => Promise<MetodoPago>;
  delete: (id: string) => Promise<void>;
}

export const tiendaService: TiendaService;
export const clienteService: ClienteService;
export const metodoPagoService: MetodoPagoService;

const api: {
  tiendaService: TiendaService;
  clienteService: ClienteService;
  metodoPagoService: MetodoPagoService;
};

export default api;