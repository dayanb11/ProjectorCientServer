import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMode } from '../../contexts/ModeContext';

interface User {
  id: number;
  employeeId: string;
  fullName: string;
  roleCode: number;
  roleDescription: string;
  procurementTeam?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { mode } = useMode();

  useEffect(() => {
    // Check if user and token are stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Clear authentication when switching to real mode
  useEffect(() => {
    if (mode === 'real' && user) {
      // Check if current user is from demo data
      const isDemoUser = user.id <= 10; // Demo users have IDs 1-10
      if (isDemoUser) {
        logout();
      }
    }
  }, [mode]);
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Token should already be stored by LoginForm, but get it here for state
    const authToken = localStorage.getItem('authToken');
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};