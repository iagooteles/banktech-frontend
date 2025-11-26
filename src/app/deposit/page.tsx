'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';

export default function DepositPage() {
  const { user, updateBalance } = useAuth();

  const [amount, setAmount] = useState<number>(0);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const agency = user?.account?.agencyNumber || '';
  const account = user?.account?.accountNumber || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      const result = await userService.deposit(
        agency,
        account,
        amount
      );
      
      const response = await userService.deposit(agency, account, amount);

      updateBalance(response.balance);
      setSuccess(result.message || 'Depósito realizado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Falha ao realizar depósito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Botão de voltar */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          ← Voltar
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Depósito
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 
              border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 font-medium">
                ✓ {success}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 
              border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 font-medium">
                ✗ {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Agência (somente leitura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Agência
              </label>
              <input
                type="text"
                value={agency}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 
                dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            {/* Conta (somente leitura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Conta
              </label>
              <input
                type="text"
                value={account}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 
                dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valor do depósito
              </label>

              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">
                  R$
                </span>

                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  required
                  className="
                    w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 
                    rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white
                    [appearance:textfield]                 /* Safari & Chrome */
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none
                  "
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || amount <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                  disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Depositando...' : 'Depositar'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 
          dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
            ℹ️ Informações
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• O depósito é creditado imediatamente</li>
            <li>• Confira o valor antes de confirmar</li>
            <li>• Operação irreversível após concluída</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
