import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombres_Dueño: '',
    apellidos_Dueño: '',
    cedula_Dueño: '',
    celular_Dueño: '',
    correo_electronico_Dueño: '',
    password_Dueño: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register(formData);
      setSuccess(true);
      setError('');
      // Redirigir al login después de un registro exitoso
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar el usuario');
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>¡Registro exitoso!</h2>
          <p>Se ha registrado correctamente. Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Registrarse</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
          </div>
          <div className="form-row">
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
          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>
        </form>
        <div className="auth-links">
          <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;