'use client';

import { useRegister } from '@/hooks/useRegister';
import React, { useState, useEffect } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { loading, error, success, register, reset } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Resetar formulário quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setFormError(null);
      reset();
    }
  }, [isOpen, reset]);

  // Fechar modal após sucesso
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [success, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError(null); // Limpar erro ao digitar
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    // Validações
    if (!formData.name.trim()) {
      setFormError('Nome é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('Email é obrigatório');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Email inválido');
      return;
    }

    if (!formData.password) {
      setFormError('Senha é obrigatória');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Senhas não conferem');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (err) {
      // Erro já está no state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Abrir Conta</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Conta criada com sucesso!</h3>
            <p className="text-gray-600">Você será redirecionado em breve...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {(formError || error) && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {formError || error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-300 text-gray-800 font-semibold rounded-lg hover:bg-amber-400 transition duration-200 disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Conta'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
