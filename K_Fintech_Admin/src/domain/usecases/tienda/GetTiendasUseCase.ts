import type { TiendaRepository } from '../../repositories/TiendaRepository';
import { TiendaEntity } from '../../entities/Tienda';

export class GetTiendasUseCase {
  private tiendaRepository: TiendaRepository;

  constructor(tiendaRepository: TiendaRepository) {
    this.tiendaRepository = tiendaRepository;
  }

  async execute(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.getAll();
  }
}