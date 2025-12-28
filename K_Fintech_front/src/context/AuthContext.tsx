import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

export interface User {
  idDueño: number;
  nombres_Dueño: string;
  apellidos_Dueño: string;
  cedula_Dueño: string;
  celular_Dueño: string;
  correo_electronico_Dueño: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch (error) {
      console.error('No se pudo verificar la autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const userData = await authAPI.login(email, password);
    setUser(userData);
  };

  const register = async (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => {
    const newUser = await authAPI.register(userData);
    setUser(newUser);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};