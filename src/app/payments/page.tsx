'use client';

import { useState } from 'react';

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'pix' | 'boleto'>('pix');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Pagamentos
        </h1>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('pix')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'pix'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              PIX
            </button>
            <button
              onClick={() => setActiveTab('boleto')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'boleto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Boleto
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'pix' ? <PixPayment /> : <BoletoPayment />}
          </div>
        </div>
      </div>
    </div>
  );
}

function PixPayment() {
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState<string | null>(null);

  const consultPixKey = async () => {
    if (!pixKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { pixService } = await import('@/services/pixService');
      const result = await pixService.consultPixKey(pixKey);
      setRecipientName(result.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chave PIX não encontrada');
      setRecipientName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { pixService } = await import('@/services/pixService');
      await pixService.sendPix({ pixKey, amount, description });
      setSuccess(true);
      setPixKey('');
      setAmount(0);
      setDescription('');
      setRecipientName(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pagamento PIX falhou');
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
    <div>
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400 font-medium">
            ✓ Pagamento PIX realizado com sucesso!
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chave PIX
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              onBlur={consultPixKey}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              required
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={consultPixKey}
              disabled={loading || !pixKey}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Consultar
            </button>
          </div>
          {recipientName && (
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              ✓ {recipientName}
            </p>
          )}
        </div>

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
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              required
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {amount > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(amount)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Pagamento produto"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !recipientName || amount <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Processando...' : 'Pagar com PIX'}
        </button>
      </form>
    </div>
  );
}

function BoletoPayment() {
  const [barcode, setBarcode] = useState('');
  const [boletoData, setBoletoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const consultBoleto = async () => {
    if (!barcode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { boletoService } = await import('@/services/boletoService');
      const boleto = await boletoService.consultBoleto(barcode);
      setBoletoData(boleto);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Boleto não encontrado');
      setBoletoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { boletoService } = await import('@/services/boletoService');
      await boletoService.payBoleto({
        barcode,
        amount: boletoData.amount,
      });
      setSuccess(true);
      setBarcode('');
      setBoletoData(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pagamento de boleto falhou');
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
    return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
  };

  return (
    <div>
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400 font-medium">
            ✓ Boleto pago com sucesso!
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Código de Barras
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ''))}
              onBlur={consultBoleto}
              placeholder="Digite o código de barras"
              required
              maxLength={48}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono"
            />
            <button
              type="button"
              onClick={consultBoleto}
              disabled={loading || !barcode}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              Consultar
            </button>
          </div>
        </div>

        {boletoData && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Beneficiário:</span>
              <span className="font-medium text-gray-900 dark:text-white">{boletoData.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Valor:</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                {formatCurrency(boletoData.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vencimento:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatDate(boletoData.dueDate)}
              </span>
            </div>
            {boletoData.status === 'OVERDUE' && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                  ⚠️ Boleto vencido
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !boletoData}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Processando...' : 'Pagar Boleto'}
        </button>
      </form>

      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          ⚠️ Confira todos os dados antes de confirmar o pagamento
        </p>
      </div>
    </div>
  );
}
