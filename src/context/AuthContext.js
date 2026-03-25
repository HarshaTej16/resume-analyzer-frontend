import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../services/apiService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    const stored = localStorage.getItem('user_info');
    const token  = localStorage.getItem('jwt_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user_info');
        localStorage.removeItem('jwt_token');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res  = await authAPI.login(email, password);
    const data = res.data || res;
    const userInfo = {
      id:       data.userId,
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
    };
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const res  = await authAPI.register(fullName, email, password);
    const data = res.data || res;
    const userInfo = {
      id:       data.userId,
      email:    data.email,
      fullName: data.fullName,
      role:     data.role,
    };
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    setUser(userInfo);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}