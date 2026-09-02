import React, { createContext, useState, useContext } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login/', { email, password });
    if (res.data.success) {
      const { access, user: userData } = res.data.data;
      setToken(access);
      setUser(userData);
      setAuthToken(access);
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (payload) => {
    try {
      const res = await api.post('/auth/register/', payload);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          throw new Error(data);
        }
        if (data.message) {
          throw new Error(data.message);
        }
        if (typeof data === 'object') {
          const messages = Object.entries(data)
            .map(([key, val]) => {
              const text = Array.isArray(val) ? val.join(' ') : String(val);
              return `${key !== 'detail' && key !== 'error' ? `${key}: ` : ''}${text}`;
            })
            .join(' | ');
          if (messages) {
            throw new Error(messages);
          }
        }
      }
      throw new Error(err.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
