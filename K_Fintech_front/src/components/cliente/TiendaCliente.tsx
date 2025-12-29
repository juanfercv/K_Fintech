import React, { useState, useEffect } from 'react';
import { tiendaService } from '../../services/api';

interface Tienda {
  idTienda: number;
  fotoTienda: string;
  nombreTienda: string;
  dueñoTienda: string;
  RUCTienda: string;
  dirección_matriz_tienda: string;
  direccion_sucursal_tienda: string;
  correo_electronico_tienda: string;
  telefono: string;
}

const TiendaCliente: React.FC = () => {
  const [tienda, setTienda] = useState<Tienda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTienda();
  }, []);

  const fetchTienda = async () => {
    try {
      setLoading(true);
      // Por ahora obtenemos la primera tienda, en una implementación real podría ser la tienda actual del usuario
      const tiendas = await tiendaService.getAll();
      if (tiendas && tiendas.length > 0) {
        setTienda(tiendas[0]); // Tomamos la primera tienda como ejemplo
      } else {
        setError('No hay tiendas disponibles');
      }
    } catch (err) {
      setError('Error al cargar los datos de la tienda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando datos de la tienda...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tienda) {
    return <div>No hay datos de la tienda disponibles</div>;
  }

  return (
    <div className="tienda-cliente-container">
      <h2>Información de la Tienda</h2>
      
      <div className="tienda-info">
        <div className="tienda-header">
          {tienda.fotoTienda && (
            <img src={tienda.fotoTienda} alt={tienda.nombreTienda} className="tienda-logo" />
          )}
          <h3>{tienda.nombreTienda}</h3>
        </div>
        
        <div className="tienda-details">
          <div className="detail-item">
            <strong>RUC:</strong> {tienda.RUCTienda}
          </div>
          
          <div className="detail-item">
            <strong>Dueño:</strong> {tienda.dueñoTienda}
          </div>
          
          <div className="detail-item">
            <strong>Dirección Matriz:</strong> {tienda.dirección_matriz_tienda}
          </div>
          
          <div className="detail-item">
            <strong>Dirección Sucursal:</strong> {tienda.direccion_sucursal_tienda}
          </div>
          
          <div className="detail-item">
            <strong>Correo Electrónico:</strong> {tienda.correo_electronico_tienda}
          </div>
          
          <div className="detail-item">
            <strong>Teléfono:</strong> {tienda.telefono}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiendaCliente;