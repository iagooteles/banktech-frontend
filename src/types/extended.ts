import { User, Transaction } from './index';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'info' | 'alert';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    amount?: number;
    transactionId?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    transactions: boolean;
    security: boolean;
    marketing: boolean;
    updates: boolean;
  };
}

// Profile types
export interface UserProfile extends User {
  avatar?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  dateOfBirth?: string;
  occupation?: string;
  monthlyIncome?: number;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActivity: string;
  isCurrent: boolean;
}

// Analytics types
export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface AnalyticsData {
  spendingByCategory: SpendingByCategory[];
  monthlyComparison: MonthlyComparison[];
  topExpenses: Transaction[];
  savingsRate: number;
  averageMonthlyExpense: number;
  goals: FinancialGoal[];
}

// Favorites types
export interface TransferFavorite {
  id: string;
  name: string;
  accountNumber: string;
  agency: string;
  bank?: string;
  pixKey?: string;
  createdAt: string;
}

export interface ScheduledPayment {
  id: string;
  type: 'transfer' | 'pix' | 'boleto';
  recipientName: string;
  amount: number;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextExecutionDate: string;
  lastExecutionDate?: string;
  status: 'active' | 'paused' | 'cancelled';
  description?: string;
}

// Investment types
export interface Investment {
  id: string;
  name: string;
  type: 'CDB' | 'LCI' | 'LCA' | 'TESOURO' | 'FUNDO' | 'ACOES';
  initialAmount: number;
  currentAmount: number;
  profitability: number;
  profitabilityType: 'CDI' | 'IPCA' | 'SELIC' | 'PRE';
  rate: number;
  investmentDate: string;
  maturityDate?: string;
  liquidityType: 'daily' | 'monthly' | 'maturity';
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'redeemed';
}

export interface InvestmentSummary {
  totalInvested: number;
  totalCurrent: number;
  totalProfit: number;
  profitPercentage: number;
  investments: Investment[];
  allocation: {
    type: string;
    amount: number;
    percentage: number;
  }[];
}

// Settings types
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  trustedDevices: string[];
  sessionTimeout: number;
  loginNotifications: boolean;
}

export interface TransactionLimits {
  dailyTransferLimit: number;
  dailyPixLimit: number;
  dailyWithdrawalLimit: number;
  monthlyLimit: number;
}

export interface AuditLog {
  id: string;
  action: string;
  description: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  status: 'success' | 'failed';
}

// Support types
export interface SupportTicket {
  id: string;
  subject: string;
  category: 'technical' | 'financial' | 'card' | 'security' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}
