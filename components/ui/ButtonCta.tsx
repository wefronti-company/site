import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';

interface ButtonCtaProps {
 label?: string;
 onClick?: () => void;
 variant?: 'primary' | 'secondary' | 'gradient';
 children?: React.ReactNode;
 type?: 'button' | 'submit';
 disabled?: boolean;
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
 label, 
 onClick,
 variant = 'primary',
 children,
 type = 'button',
 disabled = false
}) => {
 
 const router = useRouter();
 
 const handleClick = () => {
 if (onClick) {
 onClick();
 } else if (type === 'button') {
 router.push('/form');
 }
 };
 
 const isGradient = variant === 'gradient' || variant === 'primary';
 
 const gradientStyle = isGradient ? {
 background: `linear-gradient(90deg, ${colors.gradientOne}, ${colors.gradientTwo})`,
 color: colors.blackColor
 } : {};
 
 return (
 <button
 type={type}
 onClick={handleClick}
 disabled={disabled}
 className={`px-4 py-3 text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:opacity-90 animate-pulse-shadow disabled:opacity-50 disabled:cursor-not-allowed ${
 isGradient 
 ? '' 
 : 'bg-gray-200 text-black'
 }`}
 style={{ 
 borderRadius: '30px',
 ...gradientStyle,

 }}
 >
 <span suppressHydrationWarning>{children || label || 'Iniciar um projeto'}</span>
 <div 
 className="flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
 style={{
 width: '24px',
 height: '24px',
 borderRadius: '50%',
 backgroundColor: 'rgba(13, 13, 13, 1)'
 }}
 >
 <svg 
 width="14" 
 height="14" 
 viewBox="0 0 24 24" 
 fill="none" 
 stroke={colors.whiteColor}
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
