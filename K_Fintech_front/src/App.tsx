import { useState } from 'react';
import './App.css';
import Tiendas from './components/Tiendas';
import Clientes from './components/Clientes';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return !user ? children : <Navigate to="/" replace />;
};

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
          <button 
            className={activeComponent === 'home' ? 'active' : ''} 
            onClick={() => setActiveComponent('home')}
          >
            Inicio
          </button>
          <button 
            className={activeComponent === 'tiendas' ? 'active' : ''} 
            onClick={() => setActiveComponent('tiendas')}
          >
            Tiendas
          </button>
          <button 
            className={activeComponent === 'clientes' ? 'active' : ''} 
            onClick={() => setActiveComponent('clientes')}
          >
            Clientes
          </button>
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
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;