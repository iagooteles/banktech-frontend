'use client';

import { useState } from 'react';
import { transactionService } from '@/services/transactionService';
import type { TransferRequest } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function TransferPage() {
  const { user } = useAuth();
  
  const userAccount = {
    agency: user?.account?.agencyNumber ?? "",
    account: user?.account?.accountNumber ?? "",
  };

  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    recipientAgency: '',
    amount: 0,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload: TransferRequest = {
      fromAccountNumber: userAccount.account,
      toAccountNumber: formData.recipientAccountNumber,
      amount: formData.amount,
      description: formData.description,
    };

    try {
      await transactionService.transfer(payload);
      setSuccess(true);
      setFormData({
        recipientAccountNumber: '',
        recipientAgency: '',
        amount: 0,
        description: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
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
          Transferência
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✓ Transferência realizada com sucesso!
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
            {/* Agência Destinatário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agência do destinatário
              </label>
              <input
                type="text"
                value={formData.recipientAgency}
                onChange={(e) =>
                  setFormData({ ...formData, recipientAgency: e.target.value })
                }
                placeholder="0001"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Conta destinatário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conta (sem dígito)
              </label>
              <input
                type="text"
                value={formData.recipientAccountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, recipientAccountNumber: e.target.value })
                }
                placeholder="12345678"
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

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ex: Pagamento aluguel"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || formData.amount <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Processando...' : 'Transferir'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
            ℹ️ Informações importantes
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Transferências são processadas instantaneamente</li>
            <li>• Limite diário de transferências: R$ 5.000,00</li>
            <li>• Confira os dados antes de confirmar</li>
            <li>• Esta operação não pode ser desfeita</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
