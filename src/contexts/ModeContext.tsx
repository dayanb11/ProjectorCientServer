import React, { createContext, useContext, useState, useEffect } from 'react';

export type SystemMode = 'demo' | 'real';

interface ModeContextType {
  mode: SystemMode;
  toggleMode: () => void;
  toggleModeWithLogout: (logoutCallback: () => void) => void;
  tenantName: string | null;
  isDemo: boolean;
  isReal: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

interface ModeProviderProps {
  children: React.ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<SystemMode>('demo');
  const [tenantName, setTenantName] = useState<string | null>(null);

  useEffect(() => {
    // Load mode from localStorage
    const savedMode = localStorage.getItem('systemMode') as SystemMode;
    if (savedMode && ['demo', 'real'].includes(savedMode)) {
      setMode(savedMode);
    } else {
      // Default to demo mode if no saved mode exists
      setMode('demo');
      localStorage.setItem('systemMode', 'demo');
    }

    // Extract tenant name from Supabase URL for multi-tenant display
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      try {
        const url = new URL(supabaseUrl);
        const subdomain = url.hostname.split('.')[0];
        setTenantName(subdomain);
      } catch (error) {
        console.error('Error parsing Supabase URL:', error);
      }
    }
  }

  const toggleMode = () => {
    const newMode: SystemMode = mode === 'demo' ? 'real' : 'demo';
    setMode(newMode);
    localStorage.setItem('systemMode', newMode);
  };

  const toggleModeWithLogout = (logoutCallback: () => void) => {
    const newMode: SystemMode = mode === 'demo' ? 'real' : 'demo';
    
    // If switching to real mode, force logout to require DB authentication
    if (newMode === 'real') {
      logoutCallback();
    }
    
    setMode(newMode);
    localStorage.setItem('systemMode', newMode);
  };
  const value = {
    mode,
    toggleMode,
    toggleModeWithLogout,
    tenantName,
    isDemo: mode === 'demo',
    isReal: mode === 'real'
  };

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
};