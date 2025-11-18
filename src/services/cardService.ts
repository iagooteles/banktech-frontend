import type { Card, CreateCardRequest } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const cardService = {
  async getCards(): Promise<Card[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }

    return response.json();
  },

  async getCardById(id: string): Promise<Card> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch card');
    }

    return response.json();
  },

  async createCard(request: CreateCardRequest): Promise<Card> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create card');
    }

    return response.json();
  },

  async blockCard(cardId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${cardId}/block`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to block card');
    }
  },

  async unblockCard(cardId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${cardId}/unblock`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unblock card');
    }
  },

  async cancelCard(cardId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${cardId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to cancel card');
    }
  },
};
