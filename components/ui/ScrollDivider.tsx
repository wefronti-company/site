import React from 'react';
import { colors } from '../../styles/colors';

const ScrollDivider: React.FC = () => {
  return (
    <div 
      className="w-full relative flex items-center justify-center"
      style={{ height: '36px', marginBottom: '-18px' }}
    >
      {/* Linha horizontal centered vertically */}
      <div 
        className="absolute w-full h-px"
        style={{ top: '50%', transform: 'translateY(-50%)', backgroundColor: colors.borderDark }}
      />
      
      {/* Square button centered and overlapping the two sections */}
      <div 
        className="relative z-10 w-12 h-12 flex items-center justify-center border"
        style={{
          background: `linear-gradient(135deg, ${colors.gradientOne} 0%, ${colors.gradientTwo} 100%)`,
          borderColor: colors.borderDark,
          borderWidth: '1px',
          borderRadius: '5px',
          top: '50%',
          transform: 'translateY(-50%)'
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
