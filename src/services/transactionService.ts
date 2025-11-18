import type {
  Transaction,
  Statement,
  StatementRequest,
  TransferRequest,
  TransferResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transfer failed');
    }

    return response.json();
  },
};
