import type {
  Boleto,
  BoletoPaymentRequest,
  BoletoPaymentResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const boletoService = {
  async consultBoleto(barcode: string): Promise<Boleto> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/boleto/consult?barcode=${barcode}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to consult boleto');
    }

    return response.json();
  },

  async payBoleto(request: BoletoPaymentRequest): Promise<BoletoPaymentResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/boleto/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Boleto payment failed');
    }

    return response.json();
  },

  async getPaidBoletos(): Promise<Boleto[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/boleto/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boleto history');
    }

    return response.json();
  },
};
