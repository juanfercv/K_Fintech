import React, { useState, useEffect } from 'react';

interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

const MetodosPago: React.FC = () => {
  const [metodos, setMetodos] = useState<MetodoPago[]>([
    { id: 1, nombre: 'Efectivo', descripcion: 'Pago en efectivo', activo: true },
    { id: 2, nombre: 'Tarjeta de Débito', descripcion: 'Pago con tarjeta de débito', activo: true },
    { id: 3, nombre: 'Tarjeta de Crédito', descripcion: 'Pago con tarjeta de crédito', activo: true },
    { id: 4, nombre: 'Transferencia Bancaria', descripcion: 'Pago por transferencia', activo: true },
    { id: 5, nombre: 'Yape', descripcion: 'Pago por Yape', activo: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [currentMetodo, setCurrentMetodo] = useState<MetodoPago | null>(null);

  const handleCreate = () => {
    setCurrentMetodo(null);
    setShowForm(true);
  };

  const handleEdit = (metodo: MetodoPago) => {
    setCurrentMetodo(metodo);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
      setMetodos(metodos.filter(m => m.id !== id));
    }
  };

  const handleToggle = (id: number) => {
    setMetodos(metodos.map(m => 
      m.id === id ? { ...m, activo: !m.activo } : m
    ));
  };

  const handleSubmit = (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    
    const nombre = formData.get('nombre') as string;
    const descripcion = formData.get('descripcion') as string;
    
    if (currentMetodo) {
      // Actualizar método existente
      setMetodos(metodos.map(m => 
        m.id === currentMetodo.id 
          ? { ...m, nombre, descripcion } 
          : m
      ));
    } else {
      // Crear nuevo método
      const nuevoMetodo: MetodoPago = {
        id: Math.max(...metodos.map(m => m.id), 0) + 1,
        nombre,
        descripcion,
        activo: true
      };
      setMetodos([...metodos, nuevoMetodo]);
    }
    
    setShowForm(false);
  };

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

interface MetodoPagoFormProps {
  metodo: MetodoPago | null;
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

export default MetodosPago;