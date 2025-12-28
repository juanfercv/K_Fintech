export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export class MetodoPagoEntity {
  readonly id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;

  constructor(id: number, nombre: string, descripcion: string, activo: boolean) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.activo = activo;
  }
}