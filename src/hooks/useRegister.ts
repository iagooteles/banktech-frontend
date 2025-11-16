'use client';

import { RegisterData, UserResponse, userService } from '@/services/userService';
import { useState } from 'react';

export interface UseRegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  user: UserResponse | null;
}

export const useRegister = () => {
  const [state, setState] = useState<UseRegisterState>({
    loading: false,
    error: null,
    success: false,
    user: null,
  });

  const register = async (data: RegisterData) => {
    setState({ loading: true, error: null, success: false, user: null });

    try {
      const user = await userService.register(data);
      setState({ loading: false, error: null, success: true, user });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao registrar';
      setState({ loading: false, error: errorMessage, success: false, user: null });
      throw error;
    }
  };

  const reset = () => {
    setState({ loading: false, error: null, success: false, user: null });
  };

  return {
    ...state,
    register,
    reset,
  };
};
