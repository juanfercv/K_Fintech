import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { authAPI } from '../services/authAPI';

/* =======================
   TIPOS
======================= */

export interface User {
  idDueño: number;
  nombres_Dueño: string;
  apellidos_Dueño: string;
  cedula_Dueño: string;
  celular_Dueño: string;
  correo_electronico_Dueño: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
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
  refreshUser: () => Promise<void>;
}

/* =======================
   CONTEXTO
======================= */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

/* =======================
   PROVIDER
======================= */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     OBTENER SESIÓN
  ======================= */

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch {
      // 🔹 401 = no sesión → estado normal
      setUser(null);
    }
  };

  /* =======================
     INIT
  ======================= */

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };
    initAuth();
  }, []);

  /* =======================
     LOGIN
  ======================= */

  const login = async (email: string, password: string) => {
    await authAPI.login(email, password);
    await refreshUser(); // 👈 CLAVE
  };

  /* =======================
     REGISTER
  ======================= */

  const register = async (userData: {
    nombres_Dueño: string;
    apellidos_Dueño: string;
    cedula_Dueño: string;
    celular_Dueño: string;
    correo_electronico_Dueño: string;
    password_Dueño: string;
  }) => {
    await authAPI.register(userData);
    await refreshUser();
  };

  /* =======================
     LOGOUT
  ======================= */

  const logout = async () => {
    try {
      await authAPI.logout();
    } finally {
      setUser(null);
    }
  };

  /* =======================
     PROVIDER VALUE
  ======================= */

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
