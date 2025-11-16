'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, UseAuthState } from '@/hooks/useAuth';

interface AuthContextType extends UseAuthState {
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (auth.loading) {
    return <div>Carregando autenticação...</div>;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
