export interface DepositRequest {
  accountNumber: string;
  amount: number;
  description?: string;
}

export interface DepositResponse {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}