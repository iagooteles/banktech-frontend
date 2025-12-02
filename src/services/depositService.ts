import { DepositRequest, DepositResponse } from '@/types/deposit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

export const depositService = {
  async makeDeposit(depositData: DepositRequest, token: string): Promise<DepositResponse> {
    const response = await fetch(`${API_URL}/transactions/deposit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(depositData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao realizar depósito');
    }

    return response.json();
  }
};