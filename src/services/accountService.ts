import type { Account, DashboardData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const accountService = {
  async getAccount(): Promise<Account> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/accounts/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch account');
    }

    return response.json();
  },

  async getBalance(): Promise<number> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/accounts/balance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    return data.balance;
  },

  async getDashboard(): Promise<DashboardData> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return response.json();
  },
};
