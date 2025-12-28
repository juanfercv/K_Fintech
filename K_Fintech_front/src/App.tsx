import { useState } from 'react';
import './App.css';
import Tiendas from './components/Tiendas';
import Clientes from './components/Clientes';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/admin/Dashboard';
import MetodosPago from './components/admin/MetodosPago';
import TiendaAdmin from './components/admin/TiendaAdmin';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (redirige si ya está autenticado)
const PublicRoute = ({ children }) => {
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
            className={activeComponent === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveComponent('dashboard')}
            to="/dashboard"
          >
            Dashboard
          </Link>
          <Link 
            className={activeComponent === 'metodos-pago' ? 'active' : ''} 
            onClick={() => setActiveComponent('metodos-pago')}
            to="/metodos-pago"
          >
            Métodos de Pago
          </Link>
          <Link 
            className={activeComponent === 'tienda-admin' ? 'active' : ''} 
            onClick={() => setActiveComponent('tienda-admin')}
            to="/tienda-admin"
          >
            Administrar Tiendas
          </Link>
        </nav>
      </header>
      
      <main className="app-main">
        {activeComponent === 'home' && (
          <div className="home">
            <h2>Bienvenido al Sistema de Gestión</h2>
            <p>Selecciona una opción del menú para comenzar a gestionar tus tiendas o clientes.</p>
          </div>
        )}
        
        {activeComponent === 'tiendas' && <Tiendas />}
        
        {activeComponent === 'clientes' && <Clientes />}
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
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/metodos-pago" element={
            <ProtectedRoute>
              <MetodosPago />
            </ProtectedRoute>
          } />
          <Route path="/tienda-admin" element={
            <ProtectedRoute>
              <TiendaAdmin />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;