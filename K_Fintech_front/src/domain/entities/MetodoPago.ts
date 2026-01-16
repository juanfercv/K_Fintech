export class MetodoPagoEntity {
  id: number;
  nombre: string;
  codigoInterno: string;
  codigoSRI: string;
  descripcion: string;
  activo: boolean;
  permitePagoDiferido: boolean;
  maximoCuotas: number;
  integracionPasarela: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    id: number,
    nombre: string,
    codigoInterno: string,
    codigoSRI: string,
    descripcion: string,
    activo: boolean,
    permitePagoDiferido: boolean,
    maximoCuotas: number,
    integracionPasarela: boolean,
    fechaCreacion: Date,
    fechaModificacion: Date
  ) {
    this.id = id;
    this.nombre = nombre;
    this.codigoInterno = codigoInterno;
    this.codigoSRI = codigoSRI;
    this.descripcion = descripcion;
    this.activo = activo;
    this.permitePagoDiferido = permitePagoDiferido;
    this.maximoCuotas = maximoCuotas;
    this.integracionPasarela = integracionPasarela;
    this.fechaCreacion = fechaCreacion;
    this.fechaModificacion = fechaModificacion;
  }

  // 👇 ESTE ES EL MÉTODO QUE FALTABA Y QUE MAPEA LOS DATOS
  static fromBackend(data: any): MetodoPagoEntity {
    return new MetodoPagoEntity(
      // 1. Mapeo del ID (backend usa id_forma_pago, frontend usa id)
      data.id_forma_pago || data.id,
      
      data.nombre,
      
      // 2. Valores por defecto para campos que no vienen en tu consulta SQL actual
      data.codigo_interno || 'GEN-001', 
      data.codigo_sri || 'SN', 
      
      data.descripcion,
      
      // 3. Conversión segura de booleano (por si viene 1 o 0 de la BD)
      Boolean(data.activo),
      
      // 4. Mapeo de campos opcionales con defaults
      data.permite_pago_diferido ? Boolean(data.permite_pago_diferido) : false,
      data.maximo_cuotas ? Number(data.maximo_cuotas) : 1,
      data.integracion_pasarela ? Boolean(data.integracion_pasarela) : false,
      
      // 5. Fechas (si no vienen, usamos la fecha actual)
      data.created_at ? new Date(data.created_at) : new Date(),
      data.updated_at ? new Date(data.updated_at) : new Date()
    );
  }

  // Métodos de negocio
  isActive(): boolean {
    return this.activo;
  }

  enable(): void {
    this.activo = true;
    this.fechaModificacion = new Date();
  }

  disable(): void {
    this.activo = false;
    this.fechaModificacion = new Date();
  }

  updateMaxCuotas(maxCuotas: number): void {
    this.maximoCuotas = maxCuotas;
    this.fechaModificacion = new Date();
  }

  togglePagoDiferido(): void {
    this.permitePagoDiferido = !this.permitePagoDiferido;
    this.fechaModificacion = new Date();
  }

  getShortDescription(maxLength: number = 100): string {
    return this.descripcion.length > maxLength 
      ? this.descripcion.substring(0, maxLength) + '...' 
      : this.descripcion;
  }
}