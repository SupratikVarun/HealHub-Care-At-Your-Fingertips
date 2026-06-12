import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('healhubToken') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.get('/auth/me', token);
        setUser(userData);
      } catch (err) {
        setToken('');
        localStorage.removeItem('healhubToken');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [token]);

  const setAuthState = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('healhubToken', nextToken);
  };

  const login = async (phone, password) => {
    const result = await api.post('/auth/login', { phone, password });
    setAuthState(result);
    return result;
  };

  const registerPatient = async (payload) => {
    return api.post('/auth/register-patient', payload);
  };

  const registerDoctor = async (payload) => {
    return api.post('/auth/register-doctor', payload);
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('healhubToken');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, registerPatient, registerDoctor, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
