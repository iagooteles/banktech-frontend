'use client';

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/types';
import { accountService } from '@/services/accountService';
import DashboardNav from '@/components/DashboardNav';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // TODO: Remover! 
  console.log(user);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      const mockDashboard: DashboardData = {
        account: {
          id: '1',
          userId: '1',
          accountNumber: '12345-6',
          agencyNumber: '0001',
          balance: 5432.10,
          type: 'CHECKING',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        },
        recentTransactions: [
          {
            id: '1',
            accountId: '1',
            type: 'PIX',
            amount: -150.00,
            description: 'Transferência PIX para João Silva',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            recipient: { name: 'João Silva', pixKey: 'joao@email.com' }
          },
          {
            id: '2',
            accountId: '1',
            type: 'DEPOSIT',
            amount: 1200.00,
            description: 'Depósito via PIX',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            accountId: '1',
            type: 'CARD_PAYMENT',
            amount: -89.90,
            description: 'Compra no cartão - Mercado XYZ',
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          }
        ],
        cards: [
          {
            id: '1',
            accountId: '1',
            cardNumber: '****1234',
            cardholderName: 'MATHEUS DRESCH',
            expirationDate: '12/2028',
            cvv: '***',
            type: 'CREDIT',
            brand: 'VISA',
            isVirtual: false,
            status: 'ACTIVE',
            limit: 5000,
            createdAt: new Date().toISOString(),
          }
        ],
        pixKeys: [],
        monthlySpending: {
          month: 'Novembro 2025',
          amount: 2543.67,
          byCategory: [
            { category: 'Alimentação', amount: 850.00 },
            { category: 'Transporte', amount: 320.00 },
            { category: 'Lazer', amount: 450.00 },
            { category: 'Outros', amount: 923.67 }
          ]
        }
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(mockDashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          <p className="font-semibold">Erro ao carregar dashboard</p>
          <p className="text-sm mt-2">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#00AEEF] rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Olá, {user?.name ?? 'usuário'}! 👋
                </h1>
                <p className="text-blue-100">Bem-vindo de volta ao seu dashboard</p>
              </div>
              <div className="text-right">
                {/* TODO: trocar o data por user do  */}
                <p className="text-sm text-blue-100 mb-1">Agência {user?.account?.agencyNumber ?? data.account.agencyNumber}</p>
                <p className="text-sm text-blue-100">Conta {user?.account?.accountNumber ?? data.account.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/transfer" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Transferir</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Envie dinheiro</p>
            </Link>

            <Link href="/payments" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PIX</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pagar com PIX</p>
            </Link>

            <Link href="/cards" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Cartões</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gerencie cartões</p>
            </Link>

            <Link href="/investments" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-3 group-hover:bg-yellow-200 transition-colors">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Investir</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Faça render</p>
            </Link>
          </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saldo */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">Saldo Disponível</p>
                <p className="text-4xl font-bold text-green-900 dark:text-green-300 mt-2">
                  {formatCurrency(user?.account?.balance ?? data.account.balance)}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-green-600 dark:text-green-500 font-medium">
                {data.account.type === 'CHECKING' ? '💼 Conta Corrente' : '🏦 Poupança'}
              </p>
              <Link href="/transactions" className="text-xs text-green-700 dark:text-green-400 hover:underline">
                Ver extrato →
              </Link>
            </div>
          </div>

          {/* Cartões */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl shadow-md p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Cartões Ativos</p>
                <p className="text-4xl font-bold text-blue-900 dark:text-blue-300 mt-2">
                  {data.cards.filter(c => c.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-blue-600 dark:text-blue-500 font-medium">
                💳 {data.cards.filter(c => c.isVirtual).length} virtuais
              </p>
              <Link href="/cards" className="text-xs text-blue-700 dark:text-blue-400 hover:underline">
                Gerenciar →
              </Link>
            </div>
          </div>

          {/* Chaves PIX */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-md p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Chaves PIX</p>
                <p className="text-4xl font-bold text-purple-900 dark:text-purple-300 mt-2">
                  {data.pixKeys.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-purple-600 dark:text-purple-500 font-medium">
                ⚡ Transferências instantâneas
              </p>
              <Link href="/payments" className="text-xs text-purple-700 dark:text-purple-400 hover:underline">
                Usar PIX →
              </Link>
            </div>
          </div>
        </div>

        {/* Transações Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Transações Recentes
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.recentTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada
              </div>
            ) : (
              data.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'DEPOSIT' ? 'bg-green-100 dark:bg-green-900/30' :
                        transaction.type === 'TRANSFER' || transaction.type === 'PAYMENT' || transaction.type === 'PIX' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {transaction.type === 'DEPOSIT' ? (
                          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            {transaction.type}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gastos Mensais */}
        {data.monthlySpending && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Gastos do Mês
            </h2>
            <div className="flex items-baseline space-x-2 mb-6">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(data.monthlySpending.amount)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                em {data.monthlySpending.month}
              </p>
            </div>
            <div className="space-y-3">
              {data.monthlySpending.byCategory.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{cat.category}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(cat.amount / data.monthlySpending.amount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
