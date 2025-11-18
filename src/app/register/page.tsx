'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { maskCPF, maskPhone, validateCPF, validateEmail } from '@/utils/formatters';
import { userService } from '@/services/userService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cpf') {
      formattedValue = maskCPF(value);
    } else if (field === 'phone') {
      formattedValue = maskPhone(value);
    }

    setFormData({ ...formData, [field]: formattedValue });
  };

  const validateStep1 = () => {
    if (!formData.name || formData.name.length < 3) {
      showToast('Nome deve ter pelo menos 3 caracteres', 'error');
      return false;
    }
    if (!validateEmail(formData.email)) {
      showToast('Email inválido', 'error');
      return false;
    }
    if (!validateCPF(formData.cpf)) {
      showToast('CPF inválido', 'error');
      return false;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      showToast('Telefone inválido', 'error');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 8) {
      showToast('Senha deve ter pelo menos 8 caracteres', 'error');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const user = await userService.register(formData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      showToast('Conta criada com sucesso!', 'success');
      router.push('/login');
    } catch (error) {
      showToast('Erro ao criar conta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-white">
            Bank<span className="text-[#00AEEF]">Tech</span>
          </Link>
          <p className="text-gray-200 mt-2">Abra sua conta digital</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#003366]">Criar Conta</h2>
            <p className="text-gray-600 text-sm mt-1">Passo {step} de 2</p>
            
            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#00AEEF] transition-all duration-300"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <Input
                label="Nome Completo"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="João Silva"
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="joao@exemplo.com"
                required
              />

              <Input
                label="CPF"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />

              <Input
                label="Telefone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />

              <Button onClick={handleNext} fullWidth>
                Continuar
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Senha"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />

              <Input
                label="Confirmar Senha"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Digite a senha novamente"
                required
              />

              {/* Password Requirements */}
              <div className="text-xs text-gray-600 space-y-1">
                <p className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                  ✓ Mínimo 8 caracteres
                </p>
                <p className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ Pelo menos uma letra maiúscula
                </p>
                <p className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                  ✓ Pelo menos um número
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  fullWidth
                >
                  Voltar
                </Button>
                <Button type="submit" isLoading={loading} fullWidth>
                  Criar Conta
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#00AEEF] hover:text-[#003366] font-semibold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white hover:text-gray-200 text-sm">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
