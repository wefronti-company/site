import React from 'react';
import { colors } from '../../styles/colors';

interface BadgeProps {
  text: string;
  icon?: 'star' | 'rocket' | 'sparkles';
}

const Badge: React.FC<BadgeProps> = ({ text, icon = 'star' }) => {
  return (
    <div 
      className="inline-flex items-center gap-1 px-3 py-2 text-medium font-medium transition-colors w-fit"
      style={{ 
        borderRadius: '7px',
        backgroundColor: `${colors.blueColor}15`,
        color: colors.blueColor,
        border: `1px solid ${colors.blueColor}30`,
        maxWidth: 'fit-content'
      }}
    >
      {icon === 'star' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )}
      {icon === 'rocket' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
      )}
      <span>{text}</span>
    </div>
  );
};

export default Badge;
