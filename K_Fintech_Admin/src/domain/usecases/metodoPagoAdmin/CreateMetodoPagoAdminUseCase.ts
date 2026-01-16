import type { MetodoPagoAdminRepository } from '../../repositories/MetodoPagoAdminRepository';
import type { MetodoPagoAdmin, MetodoPagoAdminCreate } from '../../entities/MetodoPagoAdmin';

export class CreateMetodoPagoAdminUseCase {
  private metodoPagoRepository: MetodoPagoAdminRepository;

  constructor(metodoPagoRepository: MetodoPagoAdminRepository) {
    this.metodoPagoRepository = metodoPagoRepository;
  }

  // Recibe DTO de creación (no requiere métodos de la entidad)
  async execute(metodoPagoData: MetodoPagoAdminCreate): Promise<MetodoPagoAdmin> {

    // Aquí podrías agregar validaciones de negocio antes de guardar
    // Por ejemplo: Si integracionPasarela es true, validar que codigoSRI no esté vacío
    if (metodoPagoData.integracionPasarela && !metodoPagoData.codigoSRI) {
      // throw new Error("El código SRI es requerido para integración con pasarela");
    }

    return await this.metodoPagoRepository.create(metodoPagoData);
  }
}