import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Verify token is still valid in the background
      authService.getMe()
        .then(({ data }) => {
            if (data && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
            }
        })
          .catch((error) => {
            // Only logout if token is actually invalid (401/403)
            // Don't logout on network errors or other issues
            if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
            }
            // For other errors, keep the user logged in with cached data
        })
        .finally(() => setLoading(false));
      } catch (error) {
        // If parsing fails, clear everything
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { data } = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authService.register(userData);
      toast.success(data.message || 'Registration successful! Please verify your email.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
                     error.response?.data?.errors?.[0]?.msg || 
                     error.message || 
                     'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout: handleLogout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
