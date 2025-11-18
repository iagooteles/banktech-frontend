'use client';

import { useEffect, useState } from 'react';
import { cardService } from '@/services/cardService';
import type { Card, CreateCardRequest } from '@/types';
import DashboardNav from '@/components/DashboardNav';
import { useToast } from '@/contexts/ToastContext';

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      
      // Mock data
      const mockCards: Card[] = [
        {
          id: '1',
          accountId: '1',
          cardNumber: '1234',
          cardholderName: 'MATHEUS DRESCH',
          expirationDate: '12/2028',
          type: 'CREDIT',
          status: 'ACTIVE',
          limit: 5000,
          brand: 'VISA',
          isVirtual: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          accountId: '1',
          cardNumber: '5678',
          cardholderName: 'MATHEUS DRESCH',
          expirationDate: '08/2027',
          type: 'DEBIT',
          status: 'ACTIVE',
          brand: 'MASTERCARD',
          isVirtual: true,
          createdAt: new Date().toISOString(),
        },
      ];
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setCards(mockCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (request: CreateCardRequest) => {
    try {
      const newCard: Card = {
        id: String(cards.length + 1),
        accountId: '1',
        cardNumber: String(Math.floor(1000 + Math.random() * 9000)),
        cardholderName: 'MATHEUS DRESCH',
        expirationDate: '12/2030',
        cvv: String(Math.floor(100 + Math.random() * 900)),
        type: request.type,
        status: 'ACTIVE',
        brand: 'VISA',
        isVirtual: request.isVirtual,
        limit: request.limit,
        createdAt: new Date().toISOString(),
      };
      setCards([...cards, newCard]);
      setShowCreateModal(false);
      showToast('Cartão criado com sucesso!', 'success');
    } catch (err) {
      showToast('Erro ao criar cartão', 'error');
    }
  };

  const handleBlockCard = async (cardId: string) => {
    if (!confirm('Deseja bloquear este cartão?')) return;
    
    try {
      setCards(cards.map(c => c.id === cardId ? { ...c, status: 'BLOCKED' as const } : c));
      showToast('Cartão bloqueado com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao bloquear cartão', 'error');
    }
  };

  const handleUnblockCard = async (cardId: string) => {
    if (!confirm('Deseja desbloquear este cartão?')) return;
    
    try {
      setCards(cards.map(c => c.id === cardId ? { ...c, status: 'ACTIVE' as const } : c));
      showToast('Cartão desbloqueado com sucesso', 'success');
    } catch (err) {
      showToast('Erro ao desbloquear cartão', 'error');
    }
  };

  const handleCancelCard = async (cardId: string) => {
    if (!confirm('Deseja cancelar este cartão? Esta ação não pode ser desfeita.')) return;
    
    try {
      setCards(cards.map(c => c.id === cardId ? { ...c, status: 'CANCELLED' as const } : c));
      showToast('Cartão cancelado', 'success');
    } catch (err) {
      showToast('Erro ao cancelar cartão', 'error');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <>
        <DashboardNav />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-56 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-[#003366] to-[#00AEEF] rounded-2xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">💳 Meus Cartões</h1>
                <p className="text-blue-100">Gerencie seus cartões de débito e crédito</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-white text-[#003366] hover:bg-gray-100 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Cartão
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{cards.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ativos</p>
                  <p className="text-3xl font-bold text-green-600">{cards.filter(c => c.status === 'ACTIVE').length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Virtuais</p>
                  <p className="text-3xl font-bold text-purple-600">{cards.filter(c => c.isVirtual).length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Crédito</p>
                  <p className="text-3xl font-bold text-orange-600">{cards.filter(c => c.type === 'CREDIT').length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>
          </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="group">
              <div className={`relative rounded-2xl p-8 text-white shadow-2xl transition-all transform hover:scale-105 hover:shadow-3xl ${
                card.isVirtual 
                  ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}>
                {/* Card glow effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-br from-blue-400 to-purple-600"></div>
                
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-sm font-semibold opacity-90">
                        {card.isVirtual ? '📱 Virtual' : '💳 Físico'}
                      </p>
                      <p className="text-xs opacity-70 mt-1 font-medium">
                        {card.type === 'DEBIT' ? 'Débito' : 'Crédito'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold tracking-wider">{card.brand}</p>
                      <span className={`inline-block mt-1 text-xs px-3 py-1 rounded-full font-semibold ${
                        card.status === 'ACTIVE' ? 'bg-green-500' :
                        card.status === 'BLOCKED' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {card.status === 'ACTIVE' ? '✓ Ativo' : card.status === 'BLOCKED' ? '🔒 Bloqueado' : '✕ Cancelado'}
                      </span>
                    </div>
                  </div>

                  {/* Chip */}
                  <div className="mb-8">
                    <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg opacity-90"></div>
                  </div>

                  {/* Card Number */}
                  <div className="mb-8">
                    <p className="font-mono text-2xl tracking-widest font-bold">
                      •••• •••• •••• {card.cardNumber}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-70 mb-1 font-medium">Nome do Titular</p>
                      <p className="font-semibold text-sm tracking-wider">{card.cardholderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-70 mb-1 font-medium">Validade</p>
                      <p className="font-semibold text-sm tracking-wider">{card.expirationDate}</p>
                    </div>
                  </div>

                  {card.type === 'CREDIT' && card.limit && (
                    <div className="mt-6 pt-4 border-t border-white/30">
                      <div className="flex justify-between items-center">
                        <p className="text-xs opacity-70 font-medium">Limite Disponível</p>
                        <p className="text-lg font-bold">{formatCurrency(card.limit)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {card.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleBlockCard(card.id)}
                    className="px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                  >
                    <span>🔒</span>
                    Bloquear
                  </button>
                ) : card.status === 'BLOCKED' ? (
                  <button
                    onClick={() => handleUnblockCard(card.id)}
                    className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                  >
                    <span>🔓</span>
                    Desbloquear
                  </button>
                ) : null}
                
                {card.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleCancelCard(card.id)}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                  >
                    <span>✕</span>
                    Cancelar
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedCard(card)}
                  className="px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                >
                  <span>ℹ️</span>
                  Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nenhum cartão ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
              Crie seu primeiro cartão e aproveite todos os benefícios
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#003366] to-[#00AEEF] hover:from-[#00AEEF] hover:to-[#003366] text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105"
            >
              Criar meu primeiro cartão
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Create Card Modal */}
      {showCreateModal && (
        <CreateCardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCard}
        />
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  );
}

function CreateCardModal({ onClose, onCreate }: { onClose: () => void; onCreate: (request: CreateCardRequest) => void }) {
  const [formData, setFormData] = useState<CreateCardRequest>({
    type: 'DEBIT',
    isVirtual: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Criar Novo Cartão
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Cartão
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'DEBIT' | 'CREDIT' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="DEBIT">Débito</option>
              <option value="CREDIT">Crédito</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVirtual}
                onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Cartão Virtual
              </span>
            </label>
          </div>

          {formData.type === 'CREDIT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Limite (opcional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.limit || ''}
                onChange={(e) => setFormData({ ...formData, limit: parseFloat(e.target.value) || undefined })}
                placeholder="R$ 0,00"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Criar Cartão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CardDetailsModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Detalhes do Cartão
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Número do Cartão</p>
            <p className="text-lg font-mono text-gray-900 dark:text-white">
              **** **** **** {card.cardNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
            <p className="text-lg text-gray-900 dark:text-white">{card.cardholderName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Validade</p>
              <p className="text-lg text-gray-900 dark:text-white">{card.expirationDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bandeira</p>
              <p className="text-lg text-gray-900 dark:text-white">{card.brand}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {card.type === 'DEBIT' ? 'Débito' : 'Crédito'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-lg text-gray-900 dark:text-white">{card.status}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Modalidade</p>
            <p className="text-lg text-gray-900 dark:text-white">
              {card.isVirtual ? 'Virtual' : 'Físico'}
            </p>
          </div>

          {card.type === 'CREDIT' && card.limit && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Limite</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatCurrency(card.limit)}
              </p>
            </div>
          )}

          {card.cvv && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                ⚠️ CVV (visível apenas uma vez)
              </p>
              <p className="text-2xl font-mono font-bold text-yellow-900 dark:text-yellow-200">
                {card.cvv}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
