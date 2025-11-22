import React from 'react';
import { colors } from '../../styles/colors';

interface BadgeProps {
  text: string;
  icon?: 'star' | 'rocket' | 'sparkles';
}

const Badge: React.FC<BadgeProps> = ({ text, icon = 'star' }) => {
  return (
    <div 
      className="inline-flex items-center gap-1 px-50 py-2 text-medium font-medium transition-colors w-fit"
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
      <span>{text}</span>
    </div>
  );
};

export default Badge;
