import type { InvestmentSummary, Investment } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const investmentService = {
  async getSummary(): Promise<InvestmentSummary> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investment summary');
    }

    return response.json();
  },

  async getInvestments(): Promise<Investment[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investments');
    }

    return response.json();
  },

  async getInvestmentById(id: string): Promise<Investment> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch investment');
    }

    return response.json();
  },

  async invest(data: { type: string; amount: number }): Promise<Investment> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create investment');
    }

    return response.json();
  },

  async redeem(investmentId: string, amount?: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments/${investmentId}/redeem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to redeem investment');
    }
  },

  async simulate(type: string, amount: number, period: number): Promise<{
    estimatedReturn: number;
    profitability: number;
    maturityDate: string;
  }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/investments/simulate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, amount, period }),
    });

    if (!response.ok) {
      throw new Error('Failed to simulate investment');
    }

    return response.json();
  },
};
