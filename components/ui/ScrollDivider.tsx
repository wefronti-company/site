import React from 'react';
import { colors } from '../../styles/colors';

const ScrollDivider: React.FC = () => {
  return (
    <div 
      className="w-full relative flex items-center justify-center"
      style={{ borderBottomColor: colors.borderDark }}
    >
      {/* Linha horizontal */}
      <div 
        className="absolute w-full h-px"
        style={{ backgroundColor: colors.borderDark }}
      />
      
      {/* Círculo com seta centralizado */}
      <div 
        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border"
        style={{
          background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
          borderColor: colors.borderDark,
          borderWidth: '1px',
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={colors.whiteColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  );
};

export default ScrollDivider;
