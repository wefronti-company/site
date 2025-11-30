import React from 'react';
import { colors } from '../../styles/colors';
import { ptBR } from '../../locales/pt-BR';
import { useRouter } from 'next/router';

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
 const t = ptBR;
 const router = useRouter();
 
 const handleClick = () => {
 if (onClick) {
 onClick();
 } else {
 router.push('/form');
 }
 };
 const isPrimary = variant === 'primary';
 
 return (
 <button
 type="button"
 onClick={handleClick}
 className={`px-8 py-4 text-base font-semibold hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md ${
 isPrimary 
 ? 'text-white' 
 : 'bg-gray-200 text-black'
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
