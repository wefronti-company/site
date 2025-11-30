import React, { useState, useEffect } from 'react';
import { useHorizontalScroll } from '../../contexts/HorizontalScrollContext';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import Logo from './Logo';
import { colors } from '../../styles/colors';

// Componente do Menu - Coluna com toggle
const SideMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { currentSection, goToSection } = useHorizontalScroll();
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const { openModal } = useQuoteModal();

  // Atualiza CSS variable quando o menu abre/fecha
  useEffect(() => {
    const menuWidth = isOpen ? '320px' : '80px';
    document.documentElement.style.setProperty('--menu-width', menuWidth);
  }, [isOpen]);

  const menuItems = [
    { id: 0, label: 'Início',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { id: 1, label: 'Clientes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    { id: 2, label: 'Serviços',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    { id: 3, label: 'Projetos',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    },
    { id: 4, label: 'FAQ',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu lateral com animação - sobrepõe o conteúdo */}
      <div 
        className={`
          hidden md:flex fixed left-1 top-2 h-[calc(100vh-32px)] flex-col z-50
          transition-all duration-500 ease-in-out shadow-2xl
          ${isOpen ? 'w-80' : 'w-20'}
        `}
        style={{ borderRadius: '10px', background: colors.blackColor, border: `1px solid ${colors.borderDark}`, overflow: 'hidden' }}
      >
        {/* Header com Logo e Toggle */}
        <div className={`flex items-left transition-all duration-500 ${
          isOpen ? 'px-4 py-6 justify-between gap-3' : 'px-2 py-6 justify-center'
        }`} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {/* Logo - aumentado para 200px */}
            <button 
            onClick={() => goToSection(0)}
            className={`cursor-pointer transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}
            style={{ width: isOpen ? '170px' : '0' }}
          >
            <Logo />
          </button>
          
          {/* Botão Toggle - Alinhado com os ícones do menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 rounded-lg transition-all duration-300 flex items-center justify-center group flex-shrink-0"
            style={{ background: colors.colorGrayhover, color: colors.whiteColor }}
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
                style={{ color: colors.whiteColor }}
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
                style={{ color: colors.whiteColor }}
              >
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Items do Menu */}
        {/* use same left padding so icons keep the same x offset when opened/closed */}
        <nav className={`flex-1 p-4 px-4`}>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <React.Fragment key={item.id}>
             
                <button
                  // key moved to parent fragment
                className={
                  // keep items left-aligned when open and centered when closed
                  `w-full transition-all duration-900 flex items-center h-16 ${isOpen ? 'px-0 justify-start' : 'justify-center'}`
                }
                title={!isOpen ? item.label : undefined}
                onClick={() => goToSection(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  backgroundColor: currentSection === item.id ? colors.colorGraytab : hoveredItem === item.id ? colors.colorGrayhover : undefined,
                  color: colors.whiteColor,
                  borderRadius: currentSection === item.id || hoveredItem === item.id ? '10px' : undefined,
                  transition: 'background-color 180ms ease-in-out, color 180ms ease-in-out, border-radius 10px',
                }}
              >
                <span className="w-10 h-10 flex items-center justify-center flex-shrink-0">{item.icon}</span>
                {isOpen ? (
                  <>
                    <div className="flex-1 font-medium text-sm opacity-0 animate-[fadeIn_0.22s_ease-in-out_0.12s_forwards] translate-x-0 text-left ml-4">{item.label}</div>
                    {currentSection === item.id && (
                      <div className="w-1.5 h-1.5 rounded-full opacity-0 animate-[fadeIn_0.3s_ease-in-out_0.25s_forwards] flex-shrink-0" style={{ backgroundColor: colors.whiteColor }} />
                    )}
                  </>
                ) : (
                  <div className="flex-1 h-0 w-0 overflow-hidden" aria-hidden />
                )}
                </button>
              </React.Fragment>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default SideMenu;
