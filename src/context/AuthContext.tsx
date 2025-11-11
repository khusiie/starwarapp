import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('mock-jwt-token'));
  const isLoggedIn = !!token;
  const silentRefresh = useCallback(() => {
    if (token) {
      console.log("Mock Token Refresh: Triggered silent refresh...");
      const newToken = `mock-jwt-${Date.now()}`;
      localStorage.setItem('mock-jwt-token', newToken);
      setToken(newToken);
      console.log("Mock Token Refresh: Token refreshed successfully.");
    }
  }, [token]);

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setInterval> | null = null;
    if (isLoggedIn) {
      refreshTimer = setInterval(silentRefresh, REFRESH_INTERVAL_MS);
    }
    
    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [isLoggedIn, silentRefresh]); 

  const login = (credentials: { username: string; password: string }): boolean => {

    if (credentials.username === 'user' && credentials.password === 'pass') {
      const newToken = `mock-jwt-${Date.now()}`; 
      localStorage.setItem('mock-jwt-token', newToken);
      setToken(newToken);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('mock-jwt-token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};