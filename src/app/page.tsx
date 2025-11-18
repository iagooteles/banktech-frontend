'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#003366]">
            Bank<span className="text-[#00AEEF]">Tech</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <a href="#para-voce" className="text-gray-600 hover:text-[#00AEEF] transition duration-200">
              Para Você
            </a>
            <a href="#para-empresas" className="text-gray-600 hover:text-[#00AEEF] transition duration-200">
              Para Empresas
            </a>
            <a href="#ajuda" className="text-gray-600 hover:text-[#00AEEF] transition duration-200">
              Ajuda
            </a>
            <a href="#sobre" className="text-gray-600 hover:text-[#00AEEF] transition duration-200">
              Sobre
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              href="/register"
              className="px-4 py-2 text-[#003366] border border-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition duration-200"
            >
              Abrir Conta
            </Link>
            <Link 
              href="/login"
              className="px-5 py-2 bg-[#00AEEF] text-white rounded-lg font-semibold shadow-md hover:bg-[#003366] transition duration-200"
            >
              Acessar Conta
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-[#00AEEF] p-2 rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
            <a href="#para-voce" className="block py-2 text-gray-600 hover:text-[#00AEEF]">
              Para Você
            </a>
            <a href="#para-empresas" className="block py-2 text-gray-600 hover:text-[#00AEEF]">
              Para Empresas
            </a>
            <a href="#ajuda" className="block py-2 text-gray-600 hover:text-[#00AEEF]">
              Ajuda
            </a>
            <a href="#sobre" className="block py-2 text-gray-600 hover:text-[#00AEEF]">
              Sobre
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="py-16 md:py-24 bg-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Seu Dinheiro,<br className="hidden md:inline" /> Nosso Foco.
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Abra sua conta digital em minutos. Taxa zero, segurança máxima e o suporte que você merece.
            </p>
            <Link 
              href="/register"
              className="inline-block px-8 py-3 bg-[#00AEEF] text-white text-xl font-bold rounded-xl shadow-lg hover:bg-[#00AEEF]/80 transition duration-300 transform hover:scale-105"
            >
              Comece Agora!
            </Link>
          </div>

          <div className="md:w-1/3 w-full p-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">Acesso Rápido</h2>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/login'; }}>
              <div className="mb-4">
                <label htmlFor="agencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Agência
                </label>
                <input
                  type="text"
                  id="agencia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none"
                  placeholder="0001"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="conta" className="block text-sm font-medium text-gray-700 mb-1">
                  Conta e Dígito
                </label>
                <input
                  type="text"
                  id="conta"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00AEEF] focus:border-[#00AEEF] outline-none"
                  placeholder="12345-6"
                />
              </div>
              <div className="mb-6">
                <Link href="/forgot-password" className="text-sm text-[#00AEEF] hover:text-[#003366] transition duration-200">
                  Esqueci minha senha
                </Link>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#003366] text-white font-semibold rounded-lg hover:bg-[#003366]/90 transition duration-200"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Services Section */}
      <section className="py-16 bg-white" id="para-voce">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#003366] mb-12">Nossos Serviços em Destaque</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-[#003366] mb-2">Cartão Internacional</h3>
              <p className="text-gray-600">
                Peça seu cartão sem anuidade e com cashback em todas as compras.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-[#003366] mb-2">Investimentos Simples</h3>
              <p className="text-gray-600">
                Invista em Renda Fixa e Variável com as melhores taxas do mercado.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-[#003366] mb-2">Segurança Máxima</h3>
              <p className="text-gray-600">
                Proteção antifraude 24h e tecnologia de ponta para sua tranquilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#003366] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
            <div>
              <h4 className="font-bold mb-3 text-[#00AEEF]">BankTech</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#sobre" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Imprensa</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-[#00AEEF]">Produtos</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/register" className="hover:text-white">Contas</Link></li>
                <li><Link href="/cards" className="hover:text-white">Cartões</Link></li>
                <li><Link href="/investments" className="hover:text-white">Investimentos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-[#00AEEF]">Ajuda</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/support" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-white">Fale Conosco</Link></li>
                <li><a href="#" className="hover:text-white">Ouvidoria</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-[#00AEEF]">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 mt-6 text-center text-sm text-gray-400">
            &copy; 2025 BankTech. Todos os direitos reservados. CNPJ: 00.000.000/0001-00
          </div>
        </div>
      </footer>
    </div>
  );
}
