import type {
  PixKey,
  PixPaymentRequest,
  PixPaymentResponse,
  PixKeyType,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const pixService = {
  async getPixKeys(): Promise<PixKey[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pix/keys`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PIX keys');
    }

    return response.json();
  },

  async createPixKey(keyType: PixKeyType, keyValue: string): Promise<PixKey> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pix/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyType, keyValue }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create PIX key');
    }

    return response.json();
  },

  async deletePixKey(keyId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pix/keys/${keyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete PIX key');
    }
  },

  async sendPix(request: PixPaymentRequest): Promise<PixPaymentResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pix/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'PIX payment failed');
    }

    return response.json();
  },

  async consultPixKey(pixKey: string): Promise<{ name: string; pixKey: string }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/pix/consult?key=${encodeURIComponent(pixKey)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('PIX key not found');
    }

    return response.json();
  },
};
