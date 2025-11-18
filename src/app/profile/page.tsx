'use client';

import { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import type { UserProfile } from '@/types/extended';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { formatCPF, formatPhone, maskCPF, maskPhone, maskCEP } from '@/utils/formatters';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { showToast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (error) {
      showToast('Erro ao carregar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await profileService.updateProfile(formData);
      showToast('Perfil atualizado com sucesso!', 'success');
      setEditing(false);
      loadProfile();
    } catch (error) {
      showToast('Erro ao atualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatarUrl = await profileService.uploadAvatar(file);
      setProfile((prev) => prev ? { ...prev, avatar: avatarUrl } : null);
      showToast('Foto atualizada com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao fazer upload da foto', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>

        {/* Avatar Card */}
        <Card>
          <CardBody className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile.name.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">CPF: {formatCPF(profile.cpf)}</p>
            </div>
          </CardBody>
        </Card>

        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Informações Pessoais</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancelar' : 'Editar'}
              </Button>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome Completo"
                value={editing ? formData.name : profile.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Email"
                type="email"
                value={editing ? formData.email : profile.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
              />
              <Input
                label="Telefone"
                value={editing ? formData.phone : profile.phone}
                onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                disabled={!editing}
              />
              <Input
                label="CPF"
                value={formatCPF(profile.cpf)}
                disabled
              />
            </div>
            
            {editing && (
              <div className="pt-4">
                <Button onClick={handleSave} isLoading={loading} fullWidth>
                  Salvar Alterações
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hover onClick={() => window.location.href = '/security/2fa'}>
            <CardBody className="text-center">
              <svg className="w-12 h-12 mx-auto text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h4 className="font-semibold text-gray-900 dark:text-white">Segurança</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configurar 2FA</p>
            </CardBody>
          </Card>

          <Card hover onClick={() => window.location.href = '/settings'}>
            <CardBody className="text-center">
              <svg className="w-12 h-12 mx-auto text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h4 className="font-semibold text-gray-900 dark:text-white">Configurações</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Preferências</p>
            </CardBody>
          </Card>

          <Card hover onClick={() => window.location.href = '/profile/sessions'}>
            <CardBody className="text-center">
              <svg className="w-12 h-12 mx-auto text-purple-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h4 className="font-semibold text-gray-900 dark:text-white">Sessões</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Dispositivos ativos</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
