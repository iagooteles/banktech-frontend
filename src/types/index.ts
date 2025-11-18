// User types
export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  createdAt: string;
}

// Account types
export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  agency: string;
  balance: number;
  type: 'CHECKING' | 'SAVINGS';
  status: 'ACTIVE' | 'BLOCKED' | 'INACTIVE';
  createdAt: string;
}

// Transaction types
export type TransactionType = 'TRANSFER' | 'PAYMENT' | 'PIX' | 'DEPOSIT' | 'WITHDRAWAL' | 'CARD_PAYMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  createdAt: string;
  completedAt?: string;
  recipient?: {
    name: string;
    accountNumber?: string;
    pixKey?: string;
  };
  sender?: {
    name: string;
    accountNumber?: string;
  };
}

// Transfer types
export interface TransferRequest {
  recipientAccountNumber: string;
  recipientAgency: string;
  amount: number;
  description?: string;
}

export interface TransferResponse {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  createdAt: string;
}

// PIX types
export type PixKeyType = 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';

export interface PixKey {
  id: string;
  accountId: string;
  keyType: PixKeyType;
  keyValue: string;
  createdAt: string;
}

export interface PixPaymentRequest {
  pixKey: string;
  amount: number;
  description?: string;
}

export interface PixPaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  recipientName: string;
  createdAt: string;
}

// Boleto types
export interface Boleto {
  id: string;
  barcode: string;
  amount: number;
  dueDate: string;
  recipient: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paidAt?: string;
}

export interface BoletoPaymentRequest {
  barcode: string;
  amount: number;
}

export interface BoletoPaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  recipient: string;
  paidAt: string;
}

// Card types
export type CardType = 'DEBIT' | 'CREDIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'CANCELLED';

export interface Card {
  id: string;
  accountId: string;
  cardNumber: string; // Last 4 digits only
  cardholderName: string;
  expirationDate: string;
  cvv?: string; // Only shown on creation
  type: CardType;
  status: CardStatus;
  limit?: number; // For credit cards
  brand: 'VISA' | 'MASTERCARD' | 'ELO';
  isVirtual: boolean;
  createdAt: string;
}

export interface CreateCardRequest {
  type: CardType;
  isVirtual: boolean;
  limit?: number;
}

// Statement types
export interface Statement {
  accountId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
  summary: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransactions: number;
  };
}

export interface StatementRequest {
  startDate: string;
  endDate: string;
}

// Dashboard types
export interface DashboardData {
  account: Account;
  recentTransactions: Transaction[];
  cards: Card[];
  pixKeys: PixKey[];
  monthlySpending: {
    month: string;
    amount: number;
    byCategory: {
      category: string;
      amount: number;
    }[];
  };
}
