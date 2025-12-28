import type { MetodoPagoRepository } from '../../domain/repositories/MetodoPagoRepository';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';

const API_BASE_URL = 'http://localhost:4200';

// Alias para mantener consistencia entre nombre en frontend y backend
const METODOS_ENDPOINT = '/api/formas_pago';

interface MetodoPagoAPI {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export class MetodoPagoRepositoryImpl implements MetodoPagoRepository {
  async getAll(): Promise<MetodoPagoEntity[]> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`);
    const data: MetodoPagoAPI[] = await response.json();
    
    return data.map((item: MetodoPagoAPI) => 
      new MetodoPagoEntity(
        item.id,
        item.nombre,
        item.descripcion,
        item.activo
      )
    );
  }

  async getById(id: number): Promise<MetodoPagoEntity | null> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`);
    if (!response.ok) return null;
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      data.descripcion,
      data.activo
    );
  }

  async create(metodo: MetodoPagoEntity): Promise<MetodoPagoEntity> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodo),
    });
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      data.descripcion,
      data.activo
    );
  }

  async update(id: number, metodo: Partial<MetodoPagoEntity>): Promise<MetodoPagoEntity | null> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metodo),
    });
    
    if (!response.ok) return null;
    
    const data: MetodoPagoAPI = await response.json();
    return new MetodoPagoEntity(
      data.id,
      data.nombre,
      data.descripcion,
      data.activo
    );
  }

  async delete(id: number): Promise<boolean> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  }

  async getActive(): Promise<MetodoPagoEntity[]> {
    // En una implementación real, esto se conectaría con la API
    const response = await fetch(`${API_BASE_URL}${METODOS_ENDPOINT}/activas`);
    const data: MetodoPagoAPI[] = await response.json();
    
    return data.map((item: MetodoPagoAPI) => 
      new MetodoPagoEntity(
        item.id,
        item.nombre,
        item.descripcion,
        item.activo
      )
    );
  }
}