import React from 'react';

interface ButtonAppbarProps {
  label?: string;
  onClick?: () => void;
}

const ButtonAppbar: React.FC<ButtonAppbarProps> = ({ label = 'Iniciar um projeto', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 h-9 text-base font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
      style={{ borderRadius: '7px' }}
    >
      {label}
    </button>
  );
};

export default ButtonAppbar;
