import React from 'react';
import { colors } from '../../styles/colors';
import { useQuoteModal } from '../../contexts/QuoteModalContext';

interface ButtonAppbarProps {
  label?: string;
}

const ButtonAppbar: React.FC<ButtonAppbarProps> = ({ label = 'Falar com especialista' }) => {
  const { openModal } = useQuoteModal();
  
  return (
    <button
      type="button"
      onClick={openModal}
      className="px-6 py-2 h-11 text-base font-medium text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
      style={{ borderRadius: '7px', backgroundColor: colors.blueColor }}
    >
      {label}
    </button>
  );
};

export default ButtonAppbar;
