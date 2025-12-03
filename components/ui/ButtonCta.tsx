import React from 'react';
import { colors } from '../../styles/colors';
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
 
 const router = useRouter();
 
 const handleClick = () => {
 if (onClick) {
 onClick();
 } else {
 router.push('/form');
 }
 };
 const isPrimary = variant === 'primary';
 
 const gradientStyle = isPrimary ? {
 background: `linear-gradient(90deg, ${colors.gradientOne}, ${colors.gradientTwo})`
 } : {};
 
 return (
 <button
 type="button"
 onClick={handleClick}
 className={`px-4 py-3 text-base font-semibold transition-all duration-200 flex items-center gap-3 hover:opacity-90 ${
 isPrimary 
 ? 'text-white' 
 : 'bg-gray-200 text-black'
 }`}
 style={{ 
 borderRadius: '10px',
 ...gradientStyle,
 ...(!isPrimary && { backgroundColor: colors.blueColor })
 }}
 >
 <span>{label || 'Iniciar um projeto'}</span>
 <div 
 className="flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
 style={{
 width: '28px',
 height: '28px',
 borderRadius: '50%',
 backgroundColor: 'rgba(255, 255, 255, 1)'
 }}
 >
 <svg 
 width="16" 
 height="16" 
 viewBox="0 0 24 24" 
 fill="none" 
 stroke="currentColor"
 strokeWidth="2.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M5 12h14M12 5l7 7-7 7"/>
 </svg>
 </div>
 </button>
 );
};

export default ButtonCta;
