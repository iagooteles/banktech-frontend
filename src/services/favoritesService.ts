import type { TransferFavorite, ScheduledPayment } from '@/types/extended';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const favoritesService = {
  // Favorites
  async getFavorites(): Promise<TransferFavorite[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    return response.json();
  },

  async addFavorite(favorite: Omit<TransferFavorite, 'id' | 'createdAt'>): Promise<TransferFavorite> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorite),
    });

    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }

    return response.json();
  },

  async deleteFavorite(favoriteId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete favorite');
    }
  },

  // Scheduled Payments
  async getScheduledPayments(): Promise<ScheduledPayment[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scheduled payments');
    }

    return response.json();
  },

  async createScheduledPayment(payment: Omit<ScheduledPayment, 'id' | 'status' | 'lastExecutionDate'>): Promise<ScheduledPayment> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payment),
    });

    if (!response.ok) {
      throw new Error('Failed to create scheduled payment');
    }

    return response.json();
  },

  async updateScheduledPayment(paymentId: string, data: Partial<ScheduledPayment>): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments/${paymentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update scheduled payment');
    }
  },

  async pauseScheduledPayment(paymentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments/${paymentId}/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to pause scheduled payment');
    }
  },

  async resumeScheduledPayment(paymentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments/${paymentId}/resume`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to resume scheduled payment');
    }
  },

  async cancelScheduledPayment(paymentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/scheduled-payments/${paymentId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel scheduled payment');
    }
  },
};
