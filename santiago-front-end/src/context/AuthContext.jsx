import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { directLogin } from '../services/DirectLogin';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on first load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      const userInfo = localStorage.getItem('userInfo');

      if (token && userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (error) {
          // If parsing fails, clear localStorage
          console.error('Failed to parse user info:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login function with fallback to direct login
  const login = async (credentials) => {
    try {
      // Check if we're in production and if we should bypass normal flow
      const isProd = import.meta.env.PROD;
      const hasConnectionIssues = localStorage.getItem('connection_issues') === 'true';
      
      // For production with known issues, try direct login first
      if (isProd && hasConnectionIssues) {
        console.log('Using direct login due to known connection issues');
        const data = await directLogin(credentials);
        setUser(data.data.user);
        return data;
      }
      
      // Otherwise, use the regular login flow
      const data = await authAPI.login(credentials);
      setUser(data.data.user);
      return data;
    } catch (error) {
      // If this is the first error in production, mark that we have connection issues
      if (import.meta.env.PROD && localStorage.getItem('connection_issues') !== 'true') {
        console.log('Setting connection_issues flag for future logins');
        localStorage.setItem('connection_issues', 'true');
        
        // Try direct login as a fallback
        try {
          console.log('Attempting fallback direct login');
          const data = await directLogin(credentials);
          setUser(data.data.user);
          return data;
        } catch (directError) {
          console.error('Direct login also failed:', directError);
          throw directError;
        }
      }
      
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 