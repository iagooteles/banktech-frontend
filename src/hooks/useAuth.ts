'use client';

import { useState, useEffect, useCallback } from 'react';
import { userService, UserResponse, AuthResponse } from '@/services/userService';

export interface UseAuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  USER: 'banktech_user',
  TOKEN: 'token',
};

export const useAuth = () => {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser);
          setState({
            user,
            token: storedToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadStoredAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response: AuthResponse = await userService.login(email, password);
      const { user, token } = response;

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { user, token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setState(prev => {
      if (!prev.user) return prev;

      const updatedUser = {
        ...prev.user,
        account: {
          ...prev.user.account!,
          balance: newBalance,
        },
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      return { 
        ...prev,
        user: updatedUser
      };
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    clearError,
    updateBalance,
  };
};
