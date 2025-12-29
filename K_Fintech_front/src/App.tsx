import React from 'react';
import './App.css';
import Tiendas from './components/Tiendas';
import Clientes from './components/Clientes';
import Login from './components/Login';
import Register from './components/Register';
import MetodosPagoCliente from './components/cliente/MetodosPagoCliente';
import TiendaCliente from './components/cliente/TiendaCliente';
import DashboardCliente from './components/cliente/DashboardCliente';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Tipos para las rutas protegidas
interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

// Componente para rutas protegidas
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (redirige si ya está autenticado)
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return !user ? children : <Navigate to="/" replace />;
};

// Componente de navegación
const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Definir las rutas protegidas para mostrar en el menú
  const menuItems = [
    { path: '/', label: 'Inicio', showInMenu: true },
    { path: '/tiendas', label: 'Tiendas', showInMenu: true },
    { path: '/clientes', label: 'Clientes', showInMenu: true },
    { path: '/metodos-pago', label: 'Métodos de Pago', showInMenu: true },
    { path: '/tienda-cliente', label: 'Información de Tienda', showInMenu: true },
    { path: '/dashboard-cliente', label: 'Dashboard', showInMenu: true },
  ];

  return (
    <>
      <header className="app-header">
        <h1>Sistema de Gestión</h1>
        {user && (
          <div className="user-info">
            <span>Bienvenido, {user.nombres_Dueño} {user.apellidos_Dueño}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </div>
        )}
        {user && (
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
        )}
      </header>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="app-main">
            <Routes>
              {/* Ruta pública para login */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              {/* Ruta pública para registro */}
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/tiendas" element={
                <ProtectedRoute>
                  <Tiendas />
                </ProtectedRoute>
              } />
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <Clientes />
                </ProtectedRoute>
              } />
              <Route path="/metodos-pago" element={
                <ProtectedRoute>
                  <MetodosPagoCliente />
                </ProtectedRoute>
              } />
              <Route path="/tienda-cliente" element={
                <ProtectedRoute>
                  <TiendaCliente />
                </ProtectedRoute>
              } />
              <Route path="/dashboard-cliente" element={
                <ProtectedRoute>
                  <DashboardCliente />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Componente Home actualizado
function Home() {
  return (
    <div className="home">
      <h2>Bienvenido al Sistema de Gestión</h2>
      <p>Selecciona una opción del menú para comenzar a gestionar tus tiendas o clientes.</p>
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