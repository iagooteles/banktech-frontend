import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

class AuthService {
  private refreshTokenTimeout?: NodeJS.Timeout;

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store tokens
    this.setTokens(data.accessToken, data.refreshToken);
    
    // Start refresh token timer
    this.startRefreshTokenTimer(data.expiresIn);
    
    return data;
  }

  async register(name: string, email: string, password: string, cpf: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, cpf }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: LoginResponse = await response.json();
    
    // Store tokens
    this.setTokens(data.accessToken, data.refreshToken);
    
    // Start refresh token timer
    this.startRefreshTokenTimer(data.expiresIn);
    
    return data;
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Session expired. Please login again.');
    }

    const data: RefreshTokenResponse = await response.json();
    
    // Update access token
    localStorage.setItem('token', data.accessToken);
    
    // Restart refresh token timer
    this.startRefreshTokenTimer(data.expiresIn);
    
    return data.accessToken;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.stopRefreshTokenTimer();
    window.location.href = '/';
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private startRefreshTokenTimer(expiresIn: number): void {
    // Refresh token 1 minute before it expires
    const timeout = (expiresIn - 60) * 1000;
    
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken().catch(() => {
        this.logout();
      });
    }, timeout);
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  // Password Recovery
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to request password reset');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  // 2FA Methods
  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const token = this.getAccessToken();
    const response = await fetch(`${API_URL}/auth/2fa/enable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to enable 2FA');
    }

    return response.json();
  }

  async verify2FA(code: string): Promise<void> {
    const token = this.getAccessToken();
    const response = await fetch(`${API_URL}/auth/2fa/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Invalid 2FA code');
    }
  }

  async disable2FA(code: string): Promise<void> {
    const token = this.getAccessToken();
    const response = await fetch(`${API_URL}/auth/2fa/disable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to disable 2FA');
    }
  }

  async loginWith2FA(email: string, password: string, code: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login/2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    
    this.setTokens(data.accessToken, data.refreshToken);
    this.startRefreshTokenTimer(data.expiresIn);
    
    return data;
  }
}

export const authService = new AuthService();
