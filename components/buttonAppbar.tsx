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
      className="px-6 h-9 rounded-full text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors shadow-sm"
    >
      {label}
    </button>
  );
};

export default ButtonAppbar;
