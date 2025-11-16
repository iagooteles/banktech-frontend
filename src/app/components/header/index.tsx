'use client';
import React, { useState } from 'react';
import RegisterModal from '../registerModal';
import LoginModal from '../loginModal';
import { useAuthContext } from '@/app/context/AuthContext';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="w-full bg-white shadow-md">
        <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-amber-300">
            Bank<span className="text-amber-500">Tech</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-amber-300 transition duration-200"
            >
              Para Você
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-amber-300 transition duration-200"
            >
              Para Empresas
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-amber-300 transition duration-200"
            >
              Ajuda
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-amber-300 transition duration-200"
            >
              Sobre
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-gray-600 text-sm">
                  Olá, <span className="font-semibold text-amber-500">{user?.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-amber-300 border border-amber-300 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openRegisterModal}
                  className="px-4 py-2 text-amber-300 border border-amber-300 rounded-lg hover:bg-amber-300 hover:text-gray-800 transition duration-200"
                >
                  Abrir Conta
                </button>

                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 text-amber-300 border border-amber-300 rounded-lg hover:bg-amber-300 hover:text-gray-800 transition duration-200"
                >
                  Acessar Conta
                </button>
              </>
            )}

            <button className="md:hidden text-gray-600 hover:text-amber-300 p-2 rounded-md">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
