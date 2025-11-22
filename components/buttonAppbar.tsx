import React from 'react';

interface ButtonAppbarProps {
  label?: string;
  onClick?: () => void;
}

const ButtonAppbar: React.FC<ButtonAppbarProps> = ({ label = 'Contact', onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-6 py-2 h-9 rounded-full text-sm font-medium bg-white text-black hover:bg-white/95 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
    >
      {label}
    </button>
  );
};

export default ButtonAppbar;
