import { useState, useEffect } from 'react';
import { GetTiendasUseCase } from '../../domain/usecases/tienda/GetTiendasUseCase';
import { TiendaEntity } from '../../domain/entities/Tienda';
import { TiendaRepositoryImpl } from '../../infrastructure/repositories/TiendaRepositoryImpl';

export const useTiendaViewModel = () => {
  const [tiendas, setTiendas] = useState<TiendaEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tiendaRepository = new TiendaRepositoryImpl();
  const getTiendasUseCase = new GetTiendasUseCase(tiendaRepository);

  const cargarTiendas = async () => {
    try {
      setLoading(true);
      const tiendasResult = await getTiendasUseCase.execute();
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
  }, []);

  return {
    tiendas,
    loading,
    error,
    cargarTiendas
  };
};