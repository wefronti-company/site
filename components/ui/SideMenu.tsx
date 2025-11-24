import React, { useState, useEffect } from 'react';
import { useHorizontalScroll } from '../../contexts/HorizontalScrollContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import Logo from './Logo';
import ButtonCta from './ButtonCta';
import LanguageSelector from './LanguageSelector';

// Componente do Menu - Coluna com toggle
const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentSection, goToSection } = useHorizontalScroll();
  const { t } = useLanguage();
  const { openModal } = useQuoteModal();

  // Atualiza CSS variable quando o menu abre/fecha
  useEffect(() => {
    const menuWidth = isOpen ? '320px' : '80px';
    document.documentElement.style.setProperty('--menu-width', menuWidth);
  }, [isOpen]);

  const menuItems = [
    { id: 0, label: 'Home', icon: '🏠' },
    { id: 1, label: t.appBar.nav.clients, icon: '🤝' },
    { id: 2, label: t.appBar.nav.services, icon: '⚡' },
    { id: 3, label: t.appBar.nav.projects, icon: '🚀' },
    { id: 4, label: t.appBar.nav.faq, icon: '❓' },
    { id: 5, label: 'Contato', icon: '📧' },
  ];

  return (
    <>
      {/* Menu lateral com animação */}
      <div 
        className={`
          hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-80' : 'w-20'}
        `}
      >
        {/* Header com Logo e Toggle */}
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between gap-4">
          {/* Logo - aumentado */}
          <button 
            onClick={() => goToSection(0)}
            className={`cursor-pointer transition-all duration-300 ${isOpen ? 'scale-110' : 'scale-90 opacity-0 w-0'}`}
          >
            <Logo />
          </button>
          
          {/* Botão Toggle - Design diferenciado (círculo com animação) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-md"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {/* Círculos animados */}
            <div className="relative w-6 h-6">
              {isOpen ? (
                // Quando aberto: X estilizado com círculos
                <>
                  <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full transform -translate-x-1/2 -translate-y-1/2 rotate-45 scale-150" />
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                </>
              ) : (
                // Quando fechado: Grid de pontos
                <>
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute top-1/2 left-1 w-1.5 h-1.5 bg-gray-700 rounded-full transform -translate-y-1/2 transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute top-1/2 right-1 w-1.5 h-1.5 bg-gray-700 rounded-full transform -translate-y-1/2 transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-gray-700 rounded-full transition-all duration-300 group-hover:scale-125" />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Items do Menu */}
        <nav className={`flex-1 overflow-y-auto py-6 px-4 ${!isOpen && 'px-2'}`}>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goToSection(item.id)}
                className={`
                  w-full rounded-lg text-left
                  transition-all duration-200
                  flex items-center
                  ${isOpen ? 'px-4 py-3.5 gap-3' : 'px-2 py-3 justify-center'}
                  ${currentSection === item.id
                    ? 'bg-custom-black text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
                title={!isOpen ? item.label : undefined}
              >
                <span className={`${isOpen ? 'text-xl' : 'text-2xl'}`}>{item.icon}</span>
                {isOpen && (
                  <>
                    <div className="flex-1 font-medium text-sm">{item.label}</div>
                    {currentSection === item.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer com CTA e Language Selector */}
        {isOpen && (
          <div className="px-4 py-6 border-t border-gray-200 space-y-4">
            {/* Language Selector */}
            <div className="flex justify-center">
              <LanguageSelector />
            </div>
            
            {/* CTA Button */}
            <ButtonCta 
              label={t.hero.cta}
              variant="primary"
              onClick={openModal}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
