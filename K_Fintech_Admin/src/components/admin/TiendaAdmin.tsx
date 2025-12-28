import React, { useState } from 'react';
import { useTiendaViewModel } from '../../presentation/viewmodels/TiendaViewModel';
import { TiendaEntity } from '../../domain/entities/Tienda';

interface TiendaFormProps {
  tienda: TiendaEntity | null;
  onSubmit: (e: React.FormEvent, formData: FormData) => void;
  onCancel: () => void;
}

const TiendaForm: React.FC<TiendaFormProps> = ({ tienda, onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(e, formData);
  };

  return (
    <div className="tienda-form-overlay">
      <div className="tienda-form">
        <h3>{tienda ? 'Editar Tienda' : 'Agregar Tienda'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              defaultValue={tienda?.nombre || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="puntoEmision">Punto de Emisión:</label>
            <input
              type="text"
              id="puntoEmision"
              name="puntoEmision"
              defaultValue={tienda?.puntoEmision || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              defaultValue={tienda?.direccion || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contacto">Contacto:</label>
            <input
              type="text"
              id="contacto"
              name="contacto"
              defaultValue={tienda?.contacto || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              defaultValue={tienda?.telefono || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              defaultValue={tienda?.correo || ''}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ruc">RUC:</label>
            <input
              type="text"
              id="ruc"
              name="ruc"
              defaultValue={tienda?.ruc || ''}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {tienda ? 'Actualizar' : 'Crear'}
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

const TiendaAdmin: React.FC = () => {
  const { tiendas, loading, error } = useTiendaViewModel();
  const [showForm, setShowForm] = useState(false);
  const [currentTienda, setCurrentTienda] = useState<TiendaEntity | null>(null);

  const handleCreate = () => {
    setCurrentTienda(null);
    setShowForm(true);
  };

  const handleEdit = (tienda: TiendaEntity) => {
    setCurrentTienda(tienda);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tienda?')) {
      // Implementar lógica de eliminación
      console.log('Eliminar tienda con ID:', id);
    }
  };

  const handleSubmit = (e: React.FormEvent, formData: FormData) => {
    e.preventDefault();
    
    const nombre = formData.get('nombre') as string;
    const puntoEmision = formData.get('puntoEmision') as string;
    const direccion = formData.get('direccion') as string;
    const contacto = formData.get('contacto') as string;
    const telefono = formData.get('telefono') as string;
    const correo = formData.get('correo') as string;
    const ruc = formData.get('ruc') as string;
    
    if (currentTienda) {
      // Actualizar tienda existente
      console.log('Actualizar tienda:', { id: currentTienda.id, nombre, puntoEmision, direccion, contacto, telefono, correo, ruc });
    } else {
      // Crear nueva tienda
      console.log('Crear nueva tienda:', { nombre, puntoEmision, direccion, contacto, telefono, correo, ruc });
    }
    
    setShowForm(false);
    setCurrentTienda(null);
  };

  if (loading) {
    return <div>Cargando tiendas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="tienda-admin-container">
      <h2>Administración de Tiendas</h2>
      
      <button onClick={handleCreate} className="btn btn-primary">
        Agregar Tienda
      </button>
      
      {showForm && (
        <TiendaForm 
          tienda={currentTienda} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
      
      <div className="tiendas-list">
        {tiendas.map(tienda => (
          <div key={tienda.id} className="tienda-card">
            <h3>{tienda.nombre}</h3>
            <p><strong>Punto de Emisión:</strong> {tienda.puntoEmision}</p>
            <p><strong>Dirección:</strong> {tienda.direccion}</p>
            <p><strong>Contacto:</strong> {tienda.contacto}</p>
            <p><strong>Teléfono:</strong> {tienda.telefono}</p>
            <p><strong>Correo:</strong> {tienda.correo}</p>
            <p><strong>RUC:</strong> {tienda.ruc}</p>
            <div className="tienda-actions">
              <button onClick={() => handleEdit(tienda)} className="btn btn-secondary">
                Editar
              </button>
              <button onClick={() => handleDelete(tienda.id)} className="btn btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TiendaAdmin;