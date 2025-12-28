import React from 'react';
import { useTiendaViewModel } from '../../presentation/viewmodels/TiendaViewModel';

const TiendaCliente: React.FC = () => {
  const userId = 1; // Usamos un ID fijo para la demostración
  const { tiendas, loading, error } = useTiendaViewModel(userId);

  if (loading) {
    return <div>Cargando información de la tienda...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (tiendas.length === 0) {
    return <div>No se encontraron datos de la tienda.</div>;
  }

  const tienda = tiendas[0]; // Suponiendo que el usuario tiene una tienda asociada

  return (
    <div className="tienda-cliente-container">
      <h2>Información de la Tienda</h2>
      
      <div className="tienda-detalle">
        <div className="detalle-item">
          <strong>Nombre:</strong>
          <span>{tienda.nombre}</span>
        </div>
        
        <div className="detalle-item">
          <strong>Punto de Emisión:</strong>
          <span>{tienda.puntoEmision}</span>
        </div>
        
        <div className="detalle-item">
          <strong>Dirección:</strong>
          <span>{tienda.direccion}</span>
        </div>
        
        <div className="detalle-item">
          <strong>Contacto:</strong>
          <span>{tienda.contacto}</span>
        </div>
        
        <div className="detalle-item">
          <strong>Teléfono:</strong>
          <span>{tienda.telefono}</span>
        </div>
        
        <div className="detalle-item">
          <strong>Correo:</strong>
          <span>{tienda.correo}</span>
        </div>
        
        <div className="detalle-item">
          <strong>RUC:</strong>
          <span>{tienda.ruc}</span>
        </div>
      </div>
      
      <div className="tienda-contacto">
        <h3>Contacto</h3>
        <p>Si necesita más información, puede contactarnos a través de los datos anteriores.</p>
      </div>
    </div>
  );
};

export default TiendaCliente;