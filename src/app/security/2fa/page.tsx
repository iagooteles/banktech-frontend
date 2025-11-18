'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import Image from 'next/image';

export default function Security2FAPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEnable2FA = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.enable2FA();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setSuccess('Escaneie o QR Code com seu aplicativo autenticador');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Digite um código válido de 6 dígitos');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authService.verify2FA(verificationCode);
      setIs2FAEnabled(true);
      setSuccess('2FA ativado com sucesso!');
      setQrCode(null);
      setSecret(null);
      setVerificationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Digite um código válido de 6 dígitos');
      return;
    }

    if (!confirm('Tem certeza que deseja desativar a autenticação de dois fatores?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await authService.disable2FA(verificationCode);
      setIs2FAEnabled(false);
      setSuccess('2FA desativado com sucesso');
      setVerificationCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Autenticação de Dois Fatores (2FA)
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400">✗ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-400">✓ {success}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Status */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Status da 2FA
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {is2FAEnabled 
                  ? 'Sua conta está protegida com autenticação de dois fatores'
                  : 'Adicione uma camada extra de segurança à sua conta'
                }
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              is2FAEnabled 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
            }`}>
              {is2FAEnabled ? 'Ativado' : 'Desativado'}
            </div>
          </div>

          {/* Enable 2FA */}
          {!is2FAEnabled && !qrCode && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">
                  Como funciona?
                </h3>
                <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                  <li>1. Instale um app autenticador (Google Authenticator, Authy, etc.)</li>
                  <li>2. Escaneie o QR Code que será exibido</li>
                  <li>3. Digite o código de 6 dígitos gerado pelo app</li>
                  <li>4. Pronto! Sua conta estará mais segura</li>
                </ol>
              </div>

              <button
                onClick={handleEnable2FA}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                {loading ? 'Carregando...' : 'Ativar 2FA'}
              </button>
            </div>
          )}

          {/* QR Code Display */}
          {qrCode && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Escaneie o QR Code
                </h3>
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                </div>
              </div>

              {secret && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Ou digite manualmente o código:
                  </p>
                  <code className="block text-center font-mono text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 p-3 rounded">
                    {secret}
                  </code>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de Verificação
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center text-2xl font-mono tracking-widest"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setQrCode(null);
                    setSecret(null);
                    setVerificationCode('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleVerify2FA}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                >
                  {loading ? 'Verificando...' : 'Verificar e Ativar'}
                </button>
              </div>
            </div>
          )}

          {/* Disable 2FA */}
          {is2FAEnabled && (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-2">
                  ⚠️ Atenção
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Desativar a 2FA tornará sua conta menos segura. Você precisará do código do seu aplicativo autenticador para confirmar.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de Verificação
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-center text-2xl font-mono tracking-widest"
                />
              </div>

              <button
                onClick={handleDisable2FA}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                {loading ? 'Desativando...' : 'Desativar 2FA'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
