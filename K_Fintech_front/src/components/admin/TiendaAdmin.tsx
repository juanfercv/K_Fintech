import React, { useState, useEffect } from 'react';

interface Tienda {
  id: number;
  nombre: string;
  puntoEmision: string;
  direccion: string;
  contacto: string;
  telefono: string;
  correo: string;
  ruc: string;
}

const TiendaAdmin: React.FC = () => {
  const [tiendas, setTiendas] = useState<Tienda[]>([
    {
      id: 1,
      nombre: 'Tienda Central',
      puntoEmision: 'Punto 001',
      direccion: 'Av. Principal 123, Centro',
      contacto: 'Juan Pérez',
      telefono: '987654321',
      correo: 'contacto@tiendacentral.com',
      ruc: '20123456789'
    },
    {
      id: 2,
      nombre: 'Tienda Norte',
      puntoEmision: 'Punto 002',
      direccion: 'Av. Norte 456, Urbanización',
      contacto: 'María García',
      telefono: '976543210',
      correo: 'info@tiendanorte.com',
      ruc: '20234567890'
    }
  ]);
  const [selectedTienda, setSelectedTienda] = useState<Tienda | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleView = (tienda: Tienda) => {
    setSelectedTienda(tienda);
  };

  const handleEdit = (tienda: Tienda) => {
    setSelectedTienda(tienda);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedTienda(null);
    setShowForm(true);
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
    
    if (selectedTienda) {
      // Actualizar tienda existente
      setTiendas(tiendas.map(t => 
        t.id === selectedTienda.id 
          ? { ...t, nombre, puntoEmision, direccion, contacto, telefono, correo, ruc } 
          : t
      ));
    } else {
      // Crear nueva tienda
      const nuevaTienda: Tienda = {
        id: Math.max(...tiendas.map(t => t.id), 0) + 1,
        nombre,
        puntoEmision,
        direccion,
        contacto,
        telefono,
        correo,
        ruc
      };
      setTiendas([...tiendas, nuevaTienda]);
    }
    
    setShowForm(false);
    setSelectedTienda(null);
  };

  return (
    <div className="tienda-admin-container">
      <h2>Administración de Tiendas</h2>
      
      <button onClick={handleCreate} className="btn btn-primary">
        Agregar Tienda
      </button>
      
      {showForm && (
        <TiendaForm 
          tienda={selectedTienda} 
          onSubmit={handleSubmit} 
          onCancel={() => {
            setShowForm(false);
            setSelectedTienda(null);
          }} 
        />
      )}
      
      <div className="tiendas-list">
        {tiendas.map(tienda => (
          <div key={tienda.id} className="tienda-card">
            <div className="tienda-header">
              <h3>{tienda.nombre}</h3>
              <span className="punto-emision">Punto de Emisión: {tienda.puntoEmision}</span>
            </div>
            
            <div className="tienda-details">
              <p><strong>Dirección:</strong> {tienda.direccion}</p>
              <p><strong>Contacto:</strong> {tienda.contacto}</p>
              <p><strong>Teléfono:</strong> {tienda.telefono}</p>
              <p><strong>Correo:</strong> {tienda.correo}</p>
              <p><strong>RUC:</strong> {tienda.ruc}</p>
            </div>
            
            <div className="tienda-actions">
              <button onClick={() => handleView(tienda)} className="btn btn-secondary">
                Ver Detalles
              </button>
              <button onClick={() => handleEdit(tienda)} className="btn btn-secondary">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedTienda && !showForm && (
        <div className="tienda-details-modal">
          <div className="modal-content">
            <h3>Detalles de la Tienda</h3>
            <div className="tienda-details-full">
              <p><strong>Nombre:</strong> {selectedTienda.nombre}</p>
              <p><strong>Punto de Emisión:</strong> {selectedTienda.puntoEmision}</p>
              <p><strong>Dirección:</strong> {selectedTienda.direccion}</p>
              <p><strong>Contacto:</strong> {selectedTienda.contacto}</p>
              <p><strong>Teléfono:</strong> {selectedTienda.telefono}</p>
              <p><strong>Correo:</strong> {selectedTienda.correo}</p>
              <p><strong>RUC:</strong> {selectedTienda.ruc}</p>
            </div>
            <button 
              onClick={() => setSelectedTienda(null)} 
              className="btn btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TiendaFormProps {
  tienda: Tienda | null;
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Tienda:</label>
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
          
          <div className="form-row">
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
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico:</label>
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

export default TiendaAdmin;