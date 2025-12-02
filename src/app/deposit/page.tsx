'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DepositPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    agency: '',
    account: '',
    amount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Você precisa estar autenticado');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8081/api/transactions/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          agency: formData.agency,
          account: formData.account,
          amount: formData.amount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          agency: '',
          account: '',
          amount: 0,
        });
        
        // Redirecionar para dashboard após 2 segundos
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Erro ao realizar depósito');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar com o servidor');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Depósito
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✓ Depósito realizado com sucesso! Redirecionando para o dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 font-medium">
                ✗ {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agência
              </label>
              <input
                type="text"
                value={formData.agency}
                onChange={(e) =>
                  setFormData({ ...formData, agency: e.target.value })
                }
                placeholder="0001"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Número da Conta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número da Conta
              </label>
              <input
                type="text"
                value={formData.account}
                onChange={(e) =>
                  setFormData({ ...formData, account: e.target.value })
                }
                placeholder="12345"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0,00"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              {formData.amount > 0 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(formData.amount)}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || formData.amount <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Processando...' : 'Realizar Depósito'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
            ℹ️ Informações importantes
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Depósitos são processados instantaneamente</li>
            <li>• Não há limite para valores de depósito</li>
            <li>• Confira os dados antes de confirmar</li>
            <li>• O valor será creditado imediatamente na conta</li>
          </ul>
        </div>
      </div>
    </div>
  );
}