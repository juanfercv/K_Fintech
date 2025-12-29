import React, { useState } from 'react';
import { useMetodoPagoViewModel } from '../../presentation/viewmodels/MetodoPagoViewModel';

const MetodosPagoCliente: React.FC = () => {
  const { metodos, loading, error } = useMetodoPagoViewModel();
  const [metodosSeleccionados, setMetodosSeleccionados] = useState<number[]>([]);

  if (loading) {
    return <div>Cargando métodos de pago...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSeleccionMetodo = (id: number, checked: boolean) => {
    if (checked) {
      setMetodosSeleccionados([...metodosSeleccionados, id]);
    } else {
      setMetodosSeleccionados(metodosSeleccionados.filter(metodoId => metodoId !== id));
    }
  };

  const handleGuardarSeleccion = () => {
    console.log('Métodos seleccionados:', metodosSeleccionados);
    alert(`Ha seleccionado ${metodosSeleccionados.length} método(s) de pago`);
  };

  return (
    <div className="metodos-pago-cliente-container">
      <h2>Métodos de Pago Disponibles</h2>
      
      <div className="metodos-pago-list">
        {metodos.map(metodo => (
          <div key={metodo.id} className="metodo-pago-card">
            <h3>{metodo.nombre}</h3>
            <p>{metodo.descripcion}</p>
            <div className="metodo-estado">
              <span className={metodo.activo ? "estado-activo" : "estado-inactivo"}>
                {metodo.activo ? 'Disponible' : 'No disponible'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="seleccion-metodos">
        <h3>Seleccionar Método de Pago</h3>
        <p>Seleccione uno o varios métodos para su factura:</p>
        
        <div className="metodos-seleccion">
          {metodos
            .filter(metodo => metodo.activo) // Solo mostrar métodos activos para selección
            .map(metodo => (
            <div key={metodo.id} className="metodo-seleccion-item">
              <input 
                type="checkbox" 
                id={`metodo-${metodo.id}`} 
                name="metodos" 
                value={metodo.id}
                checked={metodosSeleccionados.includes(metodo.id)}
                onChange={(e) => handleSeleccionMetodo(metodo.id, e.target.checked)}
              />
              <label htmlFor={`metodo-${metodo.id}`}>{metodo.nombre}</label>
            </div>
          ))}
        </div>
        
        <button className="btn btn-primary" onClick={handleGuardarSeleccion}>
          Guardar Selección
        </button>
      </div>
    </div>
  );
};

export default MetodosPagoCliente;