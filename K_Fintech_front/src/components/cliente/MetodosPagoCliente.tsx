import React from 'react';
import { useMetodoPagoViewModel } from '../../presentation/viewmodels/MetodoPagoViewModel';

const MetodosPagoCliente: React.FC = () => {
  const { metodos, loading, error } = useMetodoPagoViewModel();

  if (loading) {
    return <div>Cargando métodos de pago...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="metodos-pago-cliente-container">
      <h2>Métodos de Pago Disponibles</h2>
      
      <div className="metodos-pago-list">
        {metodos.map(metodo => (
          <div key={metodo.id} className="metodo-pago-card">
            <h3>{metodo.nombre}</h3>
            <p>{metodo.descripcion}</p>
            <div className="metodo-estado">
              <span className="estado-activo">Disponible</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="seleccion-metodos">
        <h3>Seleccionar Método de Pago</h3>
        <p>Seleccione uno o varios métodos para su factura:</p>
        
        <div className="metodos-seleccion">
          {metodos.map(metodo => (
            <div key={metodo.id} className="metodo-seleccion-item">
              <input 
                type="checkbox" 
                id={`metodo-${metodo.id}`} 
                name="metodos" 
                value={metodo.id}
              />
              <label htmlFor={`metodo-${metodo.id}`}>{metodo.nombre}</label>
            </div>
          ))}
        </div>
        
        <button className="btn btn-primary">Guardar Selección</button>
      </div>
    </div>
  );
};

export default MetodosPagoCliente;