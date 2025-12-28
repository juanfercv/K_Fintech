import { useState, useEffect } from 'react';
import { GetMetodosPagoUseCase } from '../../domain/usecases/metodoPago/GetMetodosPagoUseCase';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';
import { MetodoPagoRepositoryImpl } from '../../infrastructure/repositories/MetodoPagoRepositoryImpl';

export const useMetodoPagoViewModel = () => {
  const [metodos, setMetodos] = useState<MetodoPagoEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metodoPagoRepository = new MetodoPagoRepositoryImpl();
  const getMetodosPagoUseCase = new GetMetodosPagoUseCase(metodoPagoRepository);

  const cargarMetodos = async () => {
    try {
      setLoading(true);
      const metodosResult = await getMetodosPagoUseCase.execute();
      setMetodos(metodosResult);
    } catch (err) {
      setError('Error al cargar métodos de pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetodos();
  }, []);

  return {
    metodos,
    loading,
    error,
    cargarMetodos
  };
};