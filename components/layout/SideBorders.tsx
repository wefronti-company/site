import React from 'react';
import { colors } from '../../styles/colors';

const SideBorders: React.FC = () => {
  return (
    <>
      {/* Border esquerda */}
      <div
        className="fixed top-0 h-full pointer-events-none left-2 sm:left-8 md:left-16 lg:left-24"
        style={{
          width: '1px',
          backgroundColor: colors.neutral.borderDark,
          zIndex: 999
        }}
      />
      {/* Border direita */}
      <div
        className="fixed top-0 h-full pointer-events-none right-2 sm:right-8 md:right-16 lg:right-24"
        style={{
          width: '1px',
          backgroundColor: colors.neutral.borderDark,
          zIndex: 999
        }}
      />
    </>
  );
};

export default SideBorders;
