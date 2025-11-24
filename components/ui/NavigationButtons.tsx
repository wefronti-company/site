import React from 'react';
import { useHorizontalScroll } from '../../contexts/HorizontalScrollContext';

const NavigationButtons: React.FC = () => {
  const { currentSection, totalSections, nextSection, prevSection, isTransitioning } = useHorizontalScroll();

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden md:flex gap-3">
      {/* Botão Anterior */}
      <button
        onClick={prevSection}
        disabled={currentSection === 0 || isTransitioning}
        className={`
          w-14 h-14 rounded-full 
          bg-custom-black text-white
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-xl
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
          shadow-lg
        `}
        aria-label="Seção anterior"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Botão Próximo */}
      <button
        onClick={nextSection}
        disabled={currentSection === totalSections - 1 || isTransitioning}
        className={`
          w-14 h-14 rounded-full 
          bg-custom-black text-white
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-xl
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
          shadow-lg
        `}
        aria-label="Próxima seção"
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Indicador de posição */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium whitespace-nowrap">
        {currentSection + 1} / {totalSections}
      </div>
    </div>
  );
};

export default NavigationButtons;
