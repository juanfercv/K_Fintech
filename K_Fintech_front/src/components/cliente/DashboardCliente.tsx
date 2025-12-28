import React, { useState, useEffect } from 'react';

const DashboardCliente: React.FC = () => {
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
          { metodo: 'Tarjeta de Crédito', uso: 25 },
        ],
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-cliente-container">Cargando dashboard...</div>;
  }

  return (
    <div className="dashboard-cliente-container">
      <h2>Panel de Cliente</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Facturado</h3>
          <p className="stat-value">${stats.totalFacturado.toLocaleString('es-ES')}</p>
        </div>
        
        <div className="stat-card">
          <h3>Facturas por Estado</h3>
          <div className="estado-stats">
            <div className="estado-item">
              <span>Pagadas:</span>
              <span className="estado-count">{stats.facturasPorEstado.Pagada}</span>
            </div>
            <div className="estado-item">
              <span>Pendientes:</span>
              <span className="estado-count">{stats.facturasPorEstado.Pendiente}</span>
            </div>
            <div className="estado-item">
              <span>Anuladas:</span>
              <span className="estado-count">{stats.facturasPorEstado.Anulada}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Top Clientes</h3>
          <div className="top-clientes-list">
            {stats.topClientes.map((cliente, index) => (
              <div key={index} className="cliente-item">
                <span className="cliente-rank">#{index + 1}</span>
                <span className="cliente-nombre">{cliente.nombre}</span>
                <span className="cliente-total">${cliente.total.toLocaleString('es-ES')}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Métodos de Pago Más Usados</h3>
          <div className="metodos-pago-list">
            {stats.metodosPago.map((metodo, index) => (
              <div key={index} className="metodo-item">
                <span className="metodo-nombre">{metodo.metodo}</span>
                <span className="metodo-uso">{metodo.uso}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <button className="btn btn-primary">Crear Nueva Factura</button>
          <button className="btn btn-secondary">Ver Listado de Facturas</button>
          <button className="btn btn-secondary">Ver Clientes</button>
          <button className="btn btn-secondary">Ver Tiendas</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;