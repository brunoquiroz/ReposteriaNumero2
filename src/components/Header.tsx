import React from 'react';
import { Menu, X, Settings } from 'lucide-react';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onAdminClick: () => void;
  isAdmin?: boolean;
}

export default function Header({ isMenuOpen, setIsMenuOpen, onAdminClick, isAdmin }: HeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              Dulce Arte
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-amber-700 hover:text-amber-800 transition-colors font-medium"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('productos')}
              className="text-amber-700 hover:text-amber-800 transition-colors font-medium"
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('contacto')}
              className="text-amber-700 hover:text-amber-800 transition-colors font-medium"
            >
              Contacto
            </button>
            <button
              onClick={onAdminClick}
              className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md transition-colors"
            >
              <Settings size={16} />
              <span>{isAdmin ? 'Panel Admin' : 'Admin'}</span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-amber-700 hover:text-amber-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-amber-100">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="block px-3 py-2 text-amber-700 hover:text-amber-800 transition-colors font-medium w-full text-left"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('productos')}
                className="block px-3 py-2 text-amber-700 hover:text-amber-800 transition-colors font-medium w-full text-left"
              >
                Productos
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="block px-3 py-2 text-amber-700 hover:text-amber-800 transition-colors font-medium w-full text-left"
              >
                Contacto
              </button>
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md transition-colors w-full"
              >
                <Settings size={16} />
                <span>{isAdmin ? 'Panel Admin' : 'Admin'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}