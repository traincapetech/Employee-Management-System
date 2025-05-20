import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Validate token with backend
          const isValid = await authService.checkAuth();
          
          if (isValid) {
            // Set auth token in axios headers
            authService.setAuthToken(token);
            // Decode and set user data
            const decoded = jwtDecode(token);
            setUser(decoded);
          } else {
            // Token is invalid or expired
            handleLogout();
          }
        } catch (error) {
          console.error('Authentication error:', error);
          handleLogout();
        }
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, [navigate]);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      
      if (data.token) {
        // Decode JWT to get user info
        const decoded = jwtDecode(data.token);
        setUser(decoded);
        return { role: decoded.role, success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Check if user has permission for a specific route
  const hasPermission = (allowedRoles = []) => {
    if (!user) return false;
    
    if (allowedRoles.length === 0) return true; // No specific roles required
    
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    logout: handleLogout,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 