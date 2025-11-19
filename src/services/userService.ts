const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8081';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;

  account?: {
    id: number;
    agencyNumber: string;
    accountNumber: string;
    balance: number;
    status: string;
    createdAt: string;
  };
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

export const userService = {
  async register(data: RegisterData): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao registrar: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ao fazer login: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },

  async listUsers(token: string): Promise<UserResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar usuários: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  async getUserById(id: number, token: string): Promise<UserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  async deleteUser(id: number, token: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar usuário: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },
};
