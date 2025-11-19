'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const { login, error } = useAuth(); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { user, token } = await login(formData.email, formData.password);
      // TODO: remover esse log 
      console.log("LOGIN OK:", user, token);
      router.push("/dashboard");

    } catch (err) {
      console.error('Falha no login no componente:', err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-bold text-white">
            Bank<span className="text-[#00AEEF]">Tech</span>
          </Link>
          <p className="text-gray-200 mt-2">Seu banco digital</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[#003366] mb-6">Acessar Conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange} 
              placeholder="seu@email.com"
              required
            />

            <Input
              name="password"
              label="Senha"
              type="password"
              value={formData.password}
              onChange={handleChange} 
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-[#00AEEF] focus:ring-[#00AEEF]" />
                <span className="ml-2 text-gray-600">Lembrar-me</span>
              </label>
              <Link href="/forgot-password" className="text-[#00AEEF] hover:text-[#003366] font-medium">
                Esqueceu a senha?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={loading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-[#00AEEF] hover:text-[#003366] font-semibold">
                Abrir conta grátis
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold mb-2">Credenciais de demo:</p>
            <p className="text-xs text-gray-600">Email: demo@banktech.com</p>
            <p className="text-xs text-gray-600">Senha: BankTech@123</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white hover:text-gray-200 text-sm">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
