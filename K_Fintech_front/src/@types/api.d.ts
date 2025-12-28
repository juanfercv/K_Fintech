declare module '../services/api' {
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
    id_cliente: number;
    nombre_cliente: string;
    direccion_cliente: string;
    correo_cliente: string;
    celular_cliente: string;
    cedula_cliente: string;
  }
  
  interface TiendaService {
    getAll: () => Promise<Tienda[]>;
    getById: (id: string) => Promise<Tienda>;
    create: (data: Partial<Tienda>) => Promise<Tienda>;
    update: (id: string, data: Partial<Tienda>) => Promise<Tienda>;
    delete: (id: string) => Promise<void>;
  }
  
  interface ClienteService {
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
}