import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // If you want to store basic user info in localStorage:
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const value = {
    user,
    login: async (credentials) => {
      try {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.access_token);
        
        // Store basic user info from login response if available
        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.detail || 'Login failed' };
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    },
    // Optional: If you need to update user data later
    updateUser: (userData) => {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};