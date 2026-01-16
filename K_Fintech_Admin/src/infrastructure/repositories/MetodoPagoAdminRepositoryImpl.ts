import type { MetodoPagoAdminRepository } from '../../domain/repositories/MetodoPagoAdminRepository';
import type { MetodoPagoAdmin, MetodoPagoAdminCreate, MetodoPagoAdminUpdate } from '../../domain/entities/MetodoPagoAdmin';

const API_BASE_URL = '';
const METODOS_ENDPOINT = '/api/formas_pago';

export class MetodoPagoAdminRepositoryImpl implements MetodoPagoAdminRepository {
  private async mapApiToAdmin(apiItem: any): Promise<MetodoPagoAdmin> {
    return new (await import('../../domain/entities/MetodoPagoAdmin')).MetodoPagoEntity(
      apiItem.id || apiItem.id_forma_pago,
      apiItem.nombre || '',
      apiItem.codigoInterno || apiItem.codigo_interno || '',
      apiItem.codigoSRI || apiItem.codigo_sri || '',
      apiItem.descripcion || '',
      typeof apiItem.activo === 'boolean' ? apiItem.activo : (typeof apiItem.activo !== 'undefined' ? apiItem.activo : true),
      apiItem.permitePagoDiferido ?? apiItem.permite_pago_diferido ?? false,
      apiItem.maximoCuotas ?? apiItem.maximo_cuotas ?? 1,
      apiItem.integracionPasarela ?? apiItem.integracion_pasarela ?? false,
      apiItem.habilitadoPorTienda ?? apiItem.habilitado_por_tienda ?? true,
      apiItem.configuracionTiendas ?? apiItem.configuracion_tiendas ?? [],
      apiItem.crearFormaPago ? new Date(apiItem.crearFormaPago) : new Date(),
      apiItem.actualizarFormaPago ? new Date(apiItem.actualizarFormaPago) : new Date()
    );
  }

  async getAll(): Promise<MetodoPagoAdmin[]> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`);
    const data = await res.json();
    const mapped = await Promise.all(data.map((d: any) => this.mapApiToAdmin(d)));
    return mapped;
  }

  async getActive(): Promise<MetodoPagoAdmin[]> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/activas`);
    const data = await res.json();
    const mapped = await Promise.all(data.map((d: any) => this.mapApiToAdmin(d)));
    return mapped;
  }

  async getById(id: number): Promise<MetodoPagoAdmin | null> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async create(metodoPagoData: MetodoPagoAdminCreate): Promise<MetodoPagoAdmin> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metodoPagoData)
    });
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async update(id: number, metodoPagoData: MetodoPagoAdminUpdate): Promise<MetodoPagoAdmin | null> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metodoPagoData)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return this.mapApiToAdmin(data);
  }

  async delete(id: number): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  }
}