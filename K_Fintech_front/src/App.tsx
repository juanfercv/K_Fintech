import React from 'react';
import './App.css';
import Tiendas from './components/Tiendas';
import Clientes from './components/Clientes';
import MetodosPagoCliente from './components/cliente/MetodosPagoCliente';
import TiendaCliente from './components/cliente/TiendaCliente';
import DashboardCliente from './components/cliente/DashboardCliente';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

// Componente de navegación (Menu siempre visible)
const Navigation: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Inicio' },
    { path: '/tiendas', label: 'Tiendas' },
    { path: '/clientes', label: 'Clientes' },
    { path: '/metodos-pago', label: 'Métodos de Pago' },
    { path: '/tienda-cliente', label: 'Información de Tienda' },
    { path: '/dashboard-cliente', label: 'Dashboard' },
  ];

  return (
    <header className="app-header">
      <h1>Sistema de Gestión</h1>
      <nav className="nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            to={item.path}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="app-main">
          <Routes>
            {/* Todas las rutas son accesibles directamente */}
            <Route path="/" element={<Home />} />
            <Route path="/tiendas" element={<Tiendas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/metodos-pago" element={<MetodosPagoCliente />} />
            <Route path="/tienda-cliente" element={<TiendaCliente />} />
            <Route path="/dashboard-cliente" element={<DashboardCliente />} />
            
            {/* Redirección en caso de que escriban una ruta que no existe */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h2>Bienvenido al Sistema de Gestión</h2>
      <p>Selecciona una opción del menú para comenzar.</p>
      <div className="quick-actions">
        <Link to="/tiendas" className="quick-action-card">
          <h3>Administrar Tiendas</h3>
          <p>Gestiona la información de tus tiendas</p>
        </Link>
        <Link to="/clientes" className="quick-action-card">
          <h3>Administrar Clientes</h3>
          <p>Gestiona la información de tus clientes</p>
        </Link>
        <Link to="/metodos-pago" className="quick-action-card">
          <h3>Métodos de Pago</h3>
          <p>Ver y seleccionar métodos de pago</p>
        </Link>
        <Link to="/dashboard-cliente" className="quick-action-card">
          <h3>Dashboard</h3>
          <p>Ver estadísticas y resumen general</p>
        </Link>
      </div>
    </div>
  );
}

export default App;