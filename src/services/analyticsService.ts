import type { AnalyticsData, FinancialGoal, SpendingByCategory, MonthlyComparison } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const analyticsService = {
  async getAnalytics(startDate?: string, endDate?: string): Promise<AnalyticsData> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_URL}/analytics?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  },

  async getSpendingByCategory(period: 'week' | 'month' | 'year'): Promise<SpendingByCategory[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/spending-by-category?period=${period}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch spending by category');
    }

    return response.json();
  },

  async getMonthlyComparison(months: number = 6): Promise<MonthlyComparison[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/monthly-comparison?months=${months}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch monthly comparison');
    }

    return response.json();
  },

  async exportReport(format: 'pdf' | 'excel', startDate: string, endDate: string): Promise<Blob> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ format, startDate, endDate });

    const response = await fetch(`${API_URL}/analytics/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    return response.blob();
  },

  // Financial Goals
  async getGoals(): Promise<FinancialGoal[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/goals`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }

    return response.json();
  },

  async createGoal(goal: Omit<FinancialGoal, 'id' | 'status'>): Promise<FinancialGoal> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/goals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });

    if (!response.ok) {
      throw new Error('Failed to create goal');
    }

    return response.json();
  },

  async updateGoal(goalId: string, data: Partial<FinancialGoal>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update goal');
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/analytics/goals/${goalId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete goal');
    }
  },
};
