import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lead_manager_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('lead_manager_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Session expired or invalid, logging out', err);
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('lead_manager_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem('lead_manager_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const demoLogin = async () => {
    const res = await authApi.demoLogin();
    localStorage.setItem('lead_manager_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('lead_manager_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
