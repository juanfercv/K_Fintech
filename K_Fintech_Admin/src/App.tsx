import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import MetodosPago from './components/admin/MetodosPago';
import TiendaAdmin from './components/admin/TiendaAdmin';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';

// Tipos para las rutas protegidas y públicas
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

// Componente para rutas públicas
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return !user ? children : <Navigate to="/" replace />;
};

// Componente Login simple para el admin
function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Credenciales incorrectas';
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <div className="auth-link">
          <Link to="/register">¿No tienes cuenta? Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}

// Componente Register simple para el admin
function Register() {
  const { register } = useAuth();
  const [userData, setUserData] = useState({
    nombres_Dueño: '',
    apellidos_Dueño: '',
    cedula_Dueño: '',
    celular_Dueño: '',
    correo_electronico_Dueño: '',
    password_Dueño: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(userData);
      // Redirigir al login después del registro exitoso
      window.location.href = '/login';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      setError(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Registro Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombres:</label>
            <input
              type="text"
              value={userData.nombres_Dueño}
              onChange={(e) => setUserData({...userData, nombres_Dueño: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellidos:</label>
            <input
              type="text"
              value={userData.apellidos_Dueño}
              onChange={(e) => setUserData({...userData, apellidos_Dueño: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Cédula:</label>
            <input
              type="text"
              value={userData.cedula_Dueño}
              onChange={(e) => setUserData({...userData, cedula_Dueño: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Celular:</label>
            <input
              type="text"
              value={userData.celular_Dueño}
              onChange={(e) => setUserData({...userData, celular_Dueño: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={userData.correo_electronico_Dueño}
              onChange={(e) => setUserData({...userData, correo_electronico_Dueño: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={userData.password_Dueño}
              onChange={(e) => setUserData({...userData, password_Dueño: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Registrar</button>
        </form>
        <div className="auth-link">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}

// Componente Home
function Home() {
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
        <h1>Panel de Administración - K_Fintech</h1>
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
            to="/"
          >
            Dashboard
          </Link>
          <Link 
            to="/metodos-pago"
          >
            Métodos de Pago
          </Link>
          <Link 
            to="/tienda-admin"
          >
            Administrar Tiendas
          </Link>
        </nav>
      </header>
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/metodos-pago" element={<MetodosPago />} />
          <Route path="/tienda-admin" element={<TiendaAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
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
          
          {/* Ruta protegida para el home */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;