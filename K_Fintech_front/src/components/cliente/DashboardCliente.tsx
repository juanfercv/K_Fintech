import React, { useState, useEffect } from 'react';

interface EstadoFactura {
  estado: string;
  count: number;
}

const DashboardCliente: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState({
    totalFacturado: 0,
    facturasPagadas: 0,
    facturasPendientes: 0,
    facturasAnuladas: 0,
    topCliente: "",
    metodoMasUsado: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      // Hacer la llamada al nuevo endpoint de estadísticas
      const response = await fetch('http://localhost:4200/api/dashboard/cliente');
      const data = await response.json();
      
      // Procesar los datos recibidos
      let facturasPagadas = 0;
      let facturasPendientes = 0;
      let facturasAnuladas = 0;
      
      (data.facturasPorEstado as EstadoFactura[])?.forEach((estado) => {
        if (estado.estado === 'Pagada') facturasPagadas = estado.count;
        if (estado.estado === 'Pendiente') facturasPendientes = estado.count;
        if (estado.estado === 'Anulada') facturasAnuladas = estado.count;
      });
      
      const topClienteNombre = data.topClientes && data.topClientes[0] ? data.topClientes[0].nombre_cliente : 'N/A';
      const metodoMasUsadoNombre = data.metodosPagoMasUsados && data.metodosPagoMasUsados[0] ? data.metodosPagoMasUsados[0].nombre : 'N/A';
      
      setEstadisticas({
        totalFacturado: data.totalFacturado,
        facturasPagadas,
        facturasPendientes,
        facturasAnuladas,
        topCliente: topClienteNombre,
        metodoMasUsado: metodoMasUsadoNombre
      });
    } catch (err) {
      setError('Error al cargar las estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-cliente-container">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="dashboard-cliente-container">{error}</div>;
  }

  return (
    <div className="dashboard-cliente-container">
      <h2>Dashboard Cliente</h2>
      
      <div className="estadisticas-container">
        <div className="estadistica-card">
          <h3>Total Facturado</h3>
          <p className="valor-destacado">${estadisticas.totalFacturado.toFixed(2)}</p>
        </div>
        
        <div className="estadistica-card">
          <h3>Facturas Pagadas</h3>
          <p className="valor-destacado">{estadisticas.facturasPagadas}</p>
        </div>
        
        <div className="estadistica-card">
          <h3>Facturas Pendientes</h3>
          <p className="valor-destacado">{estadisticas.facturasPendientes}</p>
        </div>
        
        <div className="estadistica-card">
          <h3>Facturas Anuladas</h3>
          <p className="valor-destacado">{estadisticas.facturasAnuladas}</p>
        </div>
      </div>
      
      <div className="informacion-adicional">
        <div className="info-card">
          <h3>Top Cliente</h3>
          <p>{estadisticas.topCliente}</p>
        </div>
        
        <div className="info-card">
          <h3>Método de Pago Más Usado</h3>
          <p>{estadisticas.metodoMasUsado}</p>
        </div>
      </div>
      
      <div className="atajos-container">
        <h3>Acciones Rápidas</h3>
        <div className="atajos-grid">
          <button className="atajo-btn">
            Ver Mis Facturas
          </button>
          <button className="atajo-btn">
            Nueva Factura
          </button>
          <button className="atajo-btn">
            Ver Métodos de Pago
          </button>
          <button className="atajo-btn">
            Ver Datos de Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;