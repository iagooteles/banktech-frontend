import React from "react";

export default function Header() {
    return (
        <header className="w-full bg-white shadow-md">
            <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-amber-300">
                    Bank<span className="text-amber-500">Tech</span>
                </div>

                <div className="hidden md:flex space-x-8">
                    <a href="#" className="text-gray-600 hover:text-secondary-cyan transition duration-200">Para Você</a>
                    <a href="#" className="text-gray-600 hover:text-secondary-cyan transition duration-200">Para Empresas</a>
                    <a href="#" className="text-gray-600 hover:text-secondary-cyan transition duration-200">Ajuda</a>
                    <a href="#" className="text-gray-600 hover:text-secondary-cyan transition duration-200">Sobre</a>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-amber-300 border border-primary-blue rounded-lg hover:bg-primary-blue hover:text-amber-700 transition duration-200">
                        Abrir Conta
                    </button>
                    <button className="px-4 py-2 text-amber-300 border border-primary-blue rounded-lg hover:bg-primary-blue hover:text-amber-700 transition duration-200">
                        Acessar Conta
                    </button>
                    <button className="md:hidden text-gray-600 hover:text-secondary-cyan p-2 rounded-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </nav>
        </header>
    );
}
