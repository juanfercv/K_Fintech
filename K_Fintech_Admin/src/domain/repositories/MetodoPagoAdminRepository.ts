import type { MetodoPagoAdmin, MetodoPagoAdminCreate, MetodoPagoAdminUpdate } from '../entities/MetodoPagoAdmin';

export interface MetodoPagoAdminRepository {
    getAll(): Promise<MetodoPagoAdmin[]>;
    getById(id: number): Promise<MetodoPagoAdmin | null>;
    create(metodo: MetodoPagoAdminCreate): Promise<MetodoPagoAdmin>;
    update(id: number, metodo: MetodoPagoAdminUpdate): Promise<MetodoPagoAdmin | null>;
    delete(id: number): Promise<boolean>;
    getActive(): Promise<MetodoPagoAdmin[]>;
}
