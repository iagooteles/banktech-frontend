import type {
  Transaction,
  Statement,
  StatementRequest,
  TransferRequest,
  TransferResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const transactionService = {
  async getTransactions(limit: number = 10): Promise<Transaction[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },

  async getTransactionById(id: string): Promise<Transaction> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transaction');
    }

    return response.json();
  },

  async getStatement(request: StatementRequest): Promise<Statement> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      startDate: request.startDate,
      endDate: request.endDate,
    });

    const response = await fetch(`${API_URL}/transactions/statement?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch statement');
    }

    return response.json();
  },

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error('Transfer failed: invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Transfer failed');
    }

    return data;
  }
};
