import React, { useState, useEffect } from 'react';
import { useHorizontalScroll } from '../../contexts/HorizontalScrollContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import Logo from './Logo';
import { colors } from '../../styles/colors';

// Componente do Menu - Coluna com toggle
const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentSection, goToSection } = useHorizontalScroll();
  const { t, language, setLanguage } = useLanguage();
  const { openModal } = useQuoteModal();

  // Atualiza CSS variable quando o menu abre/fecha
  useEffect(() => {
    const menuWidth = isOpen ? '320px' : '80px';
    document.documentElement.style.setProperty('--menu-width', menuWidth);
  }, [isOpen]);

  const menuItems = [
    { 
      id: 0, 
      label: 'Home', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      id: 1, 
      label: t.appBar.nav.clients, 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { 
      id: 2, 
      label: t.appBar.nav.services, 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    { 
      id: 3, 
      label: t.appBar.nav.projects, 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },
    { 
      id: 4, 
      label: t.appBar.nav.faq, 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
    { 
      id: 5, 
      label: 'Contato', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Backdrop com blur quando menu aberto */}
      <div
        className={`
          fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu lateral com animação - sobrepõe o conteúdo */}
      <div 
        className={`
          hidden md:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex-col z-50
          transition-all duration-300 ease-out shadow-2xl
          ${isOpen ? 'w-80' : 'w-20'}
        `}
      >
        {/* Header com Logo e Toggle */}
        <div className="px-4 py-6 border-b border-gray-200 flex items-center justify-between gap-3">
          {/* Logo - aumentado para 200px */}
          <button 
            onClick={() => goToSection(0)}
            className={`cursor-pointer transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}
            style={{ width: isOpen ? '170px' : '0' }}
          >
            <Logo />
          </button>
          
          {/* Botão Toggle - Alinhado com os ícones do menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center group flex-shrink-0 ${
              isOpen ? 'w-10 h-10' : 'w-full h-12'
            }`}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? (
              // Quando aberto: Chevrons duplos para esquerda
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            ) : (
              // Quando fechado: Chevrons duplos para direita
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            )}
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
                <span className={isOpen ? '' : 'scale-110'}>{item.icon}</span>
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
            
            {/* Separador e Título Orçamento */}
            {isOpen && (
              <>
                <div className="border-t border-gray-200 my-4" />
                <div className="px-2 pb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orçamento</span>
                </div>
              </>
            )}
            
            {/* Botão de Orçamento com blueColor */}
            <button
              onClick={() => goToSection(6)}
              style={{ backgroundColor: colors.blueColor }}
              className={`
                w-full rounded-lg text-left
                transition-all duration-200
                flex items-center
                text-white hover:opacity-90 shadow-md
                ${isOpen ? 'px-4 py-3.5 gap-3' : 'px-2 py-3 justify-center'}
              `}
              title={!isOpen ? t.hero.cta : undefined}
            >
              <span className={isOpen ? '' : 'scale-110'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </span>
              {isOpen && <div className="flex-1 font-medium text-sm">{t.hero.cta}</div>}
            </button>
          </div>
        </nav>

        {/* Footer com Seletor de Idioma Customizado */}
        {isOpen && (
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center justify-between gap-3">
              {/* Ícone e Texto - lado esquerdo */}
              <div className="flex items-center gap-2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="true" stroke="currentColor">
                  <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                </svg>
                <span className="text-sm font-medium">Idioma</span>
              </div>
              
              {/* Bandeiras - lado direito */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('pt-BR')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                    language === 'pt-BR' 
                      ? 'bg-gray-200 shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label="Português"
                  title="Português"
                >
                  🇧🇷
                </button>
                <button
                  onClick={() => setLanguage('en-US')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                    language === 'en-US' 
                      ? 'bg-gray-200 shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label="English"
                  title="English"
                >
                  🇺🇸
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
