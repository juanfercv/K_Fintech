import { useState, useEffect } from 'react';
import { GetTiendaUseCase } from '../../domain/usecases/tienda/GetTiendaUseCase';
import { TiendaEntity } from '../../domain/entities/Tienda';
import { TiendaRepositoryImpl } from '../../infrastructure/repositories/TiendaRepositoryImpl';

export const useTiendaViewModel = (userId: number) => {
  const [tiendas, setTiendas] = useState<TiendaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tiendaRepository = new TiendaRepositoryImpl();
  const getTiendaUseCase = new GetTiendaUseCase(tiendaRepository);

  const cargarTiendas = async () => {
    try {
      setLoading(true);
      const tiendasResult = await getTiendaUseCase.execute(userId);
      setTiendas(tiendasResult);
    } catch (err) {
      setError('Error al cargar tiendas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTiendas();
  }, [userId]);

  return {
    tiendas,
    loading,
    error,
    cargarTiendas
  };
};