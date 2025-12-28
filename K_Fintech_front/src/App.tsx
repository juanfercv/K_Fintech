import { useState } from 'react';
import './App.css';
import Tiendas from './components/Tiendas';
import Clientes from './components/Clientes';
import Login from './components/Login';
import Register from './components/Register';
import MetodosPagoCliente from './components/cliente/MetodosPagoCliente';
import TiendaCliente from './components/cliente/TiendaCliente';
import DashboardCliente from './components/cliente/DashboardCliente';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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

// Componente Home actualizado
function Home() {
  const [activeComponent, setActiveComponent] = useState('home');
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="app">
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
        <nav className="nav">
          <Link 
            className={activeComponent === 'home' ? 'active' : ''} 
            onClick={() => setActiveComponent('home')}
            to="/"
          >
            Inicio
          </Link>
          <Link 
            className={activeComponent === 'tiendas' ? 'active' : ''} 
            onClick={() => setActiveComponent('tiendas')}
            to="/tiendas"
          >
            Tiendas
          </Link>
          <Link 
            className={activeComponent === 'clientes' ? 'active' : ''} 
            onClick={() => setActiveComponent('clientes')}
            to="/clientes"
          >
            Clientes
          </Link>
          <Link 
            className={activeComponent === 'metodos-pago' ? 'active' : ''} 
            onClick={() => setActiveComponent('metodos-pago')}
            to="/metodos-pago"
          >
            Métodos de Pago
          </Link>
          <Link 
            className={activeComponent === 'tienda-cliente' ? 'active' : ''} 
            onClick={() => setActiveComponent('tienda-cliente')}
            to="/tienda-cliente"
          >
            Información de Tienda
          </Link>
          <Link 
            className={activeComponent === 'dashboard-cliente' ? 'active' : ''} 
            onClick={() => setActiveComponent('dashboard-cliente')}
            to="/dashboard-cliente"
          >
            Dashboard
          </Link>
        </nav>
      </header>
      
      <main className="app-main">
        {activeComponent === 'home' && (
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
        )}
        
        {activeComponent === 'tiendas' && <Tiendas />}
        
        {activeComponent === 'clientes' && <Clientes />}
        
        {activeComponent === 'metodos-pago' && <MetodosPagoCliente />}
        
        {activeComponent === 'tienda-cliente' && <TiendaCliente />}
        
        {activeComponent === 'dashboard-cliente' && <DashboardCliente />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;