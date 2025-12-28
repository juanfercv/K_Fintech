import React, { useState } from 'react';
import { useMetodoPagoViewModel } from '../../presentation/viewmodels/MetodoPagoViewModel';
import { MetodoPagoEntity } from '../../domain/entities/MetodoPago';

interface MetodoPagoFormProps {
  metodo: MetodoPagoEntity | null;
  onSubmit: (e: React.FormEvent, formData: FormData) => void;
  onCancel: () => void;
}

const MetodoPagoForm: React.FC<MetodoPagoFormProps> = ({ metodo, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(e, formData);
  };

  return (
    <div className="metodo-form-overlay">
      <div className="metodo-form">
        <h3>{metodo ? 'Editar Método de Pago' : 'Agregar Método de Pago'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={metodo?.nombre || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              defaultValue={metodo?.descripcion || ''}
              required
              rows={3}
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {metodo ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MetodosPago: React.FC = () => {
  const { metodos, loading, error, crearMetodo, actualizarMetodo, eliminarMetodo } = useMetodoPagoViewModel();
  const [showForm, setShowForm] = useState(false);
  const [currentMetodo, setCurrentMetodo] = useState<MetodoPagoEntity | null>(null);

  const handleCreate = () => {
    setCurrentMetodo(null);
    setShowForm(true);
  };

  const handleEdit = (metodo: MetodoPagoEntity) => {
    setCurrentMetodo(metodo);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      try {
        await eliminarMetodo(id);
      } catch (err) {
        console.error('Error al eliminar método:', err);
      }
    }
  };

  const handleToggle = async (id: number) => {
    const metodo = metodos.find(m => m.id === id);
    if (metodo) {
      try {
        await actualizarMetodo(id, { activo: !metodo.activo });
      } catch (err) {
        console.error('Error al actualizar método:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    
    try {
      if (currentMetodo) {
        // Actualizar método existente
        await actualizarMetodo(currentMetodo.id, { nombre, descripcion });
      } else {
        // Crear nuevo método
        await crearMetodo(nombre, descripcion, true);
      }
      
      setShowForm(false);
      setCurrentMetodo(null);
    } catch (err) {
      console.error('Error al guardar método:', err);
    }
  };

  if (loading) {
    return <div>Cargando métodos de pago...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="metodos-pago-container">
      <h2>Métodos de Pago</h2>
      
      <button onClick={handleCreate} className="btn btn-primary">
        Agregar Método de Pago
      </button>
      
      {showForm && (
        <MetodoPagoForm 
          metodo={currentMetodo} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
      
      <div className="metodos-pago-list">
        {metodos.map(metodo => (
          <div key={metodo.id} className="metodo-pago-card">
            <h3>{metodo.nombre}</h3>
            <p>{metodo.descripcion}</p>
            <div className="metodo-actions">
              <button 
                onClick={() => handleToggle(metodo.id)}
                className={`btn ${metodo.activo ? 'btn-secondary' : 'btn-warning'}`}
              >
                {metodo.activo ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => handleEdit(metodo)} className="btn btn-secondary">
                Editar
              </button>
              <button onClick={() => handleDelete(metodo.id)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetodosPago;