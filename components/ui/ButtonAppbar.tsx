import React from 'react';
import { colors } from '../../styles/colors';

interface ButtonAppbarProps {
  label?: string;
  onClick?: () => void;
}

const ButtonAppbar: React.FC<ButtonAppbarProps> = ({ label = 'Iniciar um projeto', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 h-11 text-base font-medium text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
      style={{ borderRadius: '7px', backgroundColor: colors.blueColor }}
    >
      {label}
    </button>
  );
};

export default ButtonAppbar;
