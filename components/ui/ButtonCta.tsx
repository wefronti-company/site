import React from 'react';
import { colors } from '../../styles/colors';
import { useLanguage } from '../../contexts/LanguageContext';

interface ButtonCtaProps {
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
  label, 
  onClick,
  variant = 'primary' 
}) => {
  const { t } = useLanguage();
  const isPrimary = variant === 'primary';
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-8 py-4 text-base font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md ${
        isPrimary 
          ? 'text-white' 
          : 'bg-gray-200 dark:bg-[#1a1a1a] text-black dark:text-white'
      }`}
      style={{ 
        borderRadius: '7px',
        ...(isPrimary && { backgroundColor: colors.blueColor })
      }}
    >
      {label || t.hero.cta}
    </button>
  );
};

export default ButtonCta;
