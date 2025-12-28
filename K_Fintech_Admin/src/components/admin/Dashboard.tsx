import React, { useState, useEffect } from 'react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalFacturado: 0,
    facturasPorEstado: { Pagada: 0, Pendiente: 0, Anulada: 0 },
    topClientes: [] as { nombre: string; total: number }[],
    metodosPago: [] as { metodo: string; uso: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      // Simular datos del dashboard - en la implementación real, estos vendrían de la API
      setStats({
        totalFacturado: 12500.50,
        facturasPorEstado: { Pagada: 24, Pendiente: 8, Anulada: 2 },
        topClientes: [
          { nombre: 'Juan Pérez', total: 3200 },
          { nombre: 'María García', total: 2800 },
          { nombre: 'Carlos López', total: 2100 },
        ],
        metodosPago: [
          { metodo: 'Efectivo', uso: 45 },
          { metodo: 'Tarjeta de Débito', uso: 30 },
          { metodo: 'Tarjeta de Crédito', uso: 15 },
          { metodo: 'Transferencia', uso: 7 },
          { metodo: 'Yape', uso: 3 },
        ],
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Panel de Administración</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Facturado</h3>
          <p className="stat-value">S/. {stats.totalFacturado.toFixed(2)}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Pagadas</h3>
          <p className="stat-value">{stats.facturasPorEstado.Pagada}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Pendientes</h3>
          <p className="stat-value">{stats.facturasPorEstado.Pendiente}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas Anuladas</h3>
          <p className="stat-value">{stats.facturasPorEstado.Anulada}</p>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="chart-section">
          <h3>Top Clientes</h3>
          <div className="chart-placeholder">
            {stats.topClientes.map((cliente, index) => (
              <div key={index} className="cliente-item">
                <span className="cliente-nombre">{cliente.nombre}</span>
                <span className="cliente-total">S/. {cliente.total}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-section">
          <h3>Métodos de Pago</h3>
          <div className="chart-placeholder">
            {stats.metodosPago.map((metodo, index) => (
              <div key={index} className="metodo-item">
                <span className="metodo-nombre">{metodo.metodo}</span>
                <span className="metodo-uso">{metodo.uso}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Acciones Rápidas</h3>
        <div className="actions-grid">
          <button className="action-btn">Crear Nueva Factura</button>
          <button className="action-btn">Ver Listado de Facturas</button>
          <button className="action-btn">Ver Listado de Clientes</button>
          <button className="action-btn">Ver Listado de Tiendas</button>
        </div>
      </div>
    </div>
  );
};

// Aseguramos que la exportación es correcta
export default Dashboard;
