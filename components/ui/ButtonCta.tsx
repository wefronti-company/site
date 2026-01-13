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
 className?: string; // optional to allow sizing from parent
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
 label, 
 onClick,
 variant = 'primary',
 children,
 type = 'button',
 disabled = false,
 className
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
 background: colors.primary.white,
 color: colors.primary.black
 } : {};
 
 return (
 <button
 type={type}
 onClick={handleClick}
 disabled={disabled}
 className={`px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
 isGradient 
 ? '' 
 : 'bg-gray-200 text-black'
 } ${className || ''}`.trim()}
 style={{ 
 borderRadius: '1px',
 ...gradientStyle,

 }}
 >
 <span className="w-full text-center" suppressHydrationWarning>{children || label || 'Agendar uma reunião'}</span>
 <div 
 className="flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
 >
 </div>
 </button>
 );
};

export default ButtonCta;
