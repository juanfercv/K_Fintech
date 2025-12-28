import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombres_Dueño: '',
    apellidos_Dueño: '',
    cedula_Dueño: '',
    celular_Dueño: '',
    correo_electronico_Dueño: '',
    password_Dueño: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      // Después del registro exitoso, mostrar mensaje de éxito
      alert('Registro exitoso. Por favor, inicia sesión con tus credenciales.');
      // Mostrar botón para ir al login en lugar de redirigir automáticamente
      setShowLoginButton(true);
    } catch (error) {
      setError('Error en el registro. Por favor, intenta de nuevo.');
      console.error('Error en el registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Registro</h2>
        {error && <div className="error-message">{error}</div>}
        
        {!showLoginButton ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombres_Dueño">Nombres:</label>
              <input
                type="text"
                id="nombres_Dueño"
                name="nombres_Dueño"
                value={formData.nombres_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellidos_Dueño">Apellidos:</label>
              <input
                type="text"
                id="apellidos_Dueño"
                name="apellidos_Dueño"
                value={formData.apellidos_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cedula_Dueño">Cédula:</label>
              <input
                type="text"
                id="cedula_Dueño"
                name="cedula_Dueño"
                value={formData.cedula_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="celular_Dueño">Celular:</label>
              <input
                type="text"
                id="celular_Dueño"
                name="celular_Dueño"
                value={formData.celular_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="correo_electronico_Dueño">Correo Electrónico:</label>
              <input
                type="email"
                id="correo_electronico_Dueño"
                name="correo_electronico_Dueño"
                value={formData.correo_electronico_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password_Dueño">Contraseña:</label>
              <input
                type="password"
                id="password_Dueño"
                name="password_Dueño"
                value={formData.password_Dueño}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <h3>¡Registro exitoso!</h3>
            <p>Por favor, inicia sesión con tus credenciales.</p>
            <button 
              className="btn btn-primary" 
              onClick={handleGoToLogin}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
        
        {showLoginButton ? (
          <p className="auth-link">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        ) : (
          <p className="auth-link">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;