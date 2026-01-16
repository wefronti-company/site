import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';
import { ArrowUpRight } from 'lucide-react';

interface ButtonCtaProps {
 label?: string;
 onClick?: () => void;
 variant?: 'primary' | 'secondary' | 'gradient';
 design?: 'default' | 'split';
 children?: React.ReactNode;
 type?: 'button' | 'submit';
 disabled?: boolean;
 className?: string; // optional to allow sizing from parent
}

const ButtonCta: React.FC<ButtonCtaProps> = ({ 
 label, 
 onClick,
 variant = 'primary',
 design = 'default',
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
 background: colors.purple.primary,
 color: colors.primary.black
 } : {};
 
 // Split / pill design
 if (design === 'split') {
   return (
     <button
       type={type}
       onClick={handleClick}
       disabled={disabled}
       aria-label={label || (typeof children === 'string' ? children : 'CTA')}
       className={`inline-flex items-center justify-center gap-3 transition-all duration-200 hover:gap-4 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
       style={{ border: 'none', background: colors.purple.tertiary, borderRadius: '999px', padding: '14px 28px' }}
     >
       {/* Texto */}
       <span
         className="text-[18px] font-semibold leading-none"
         style={{
           color: colors.primary.white,
         }}
       >
         {children || label || 'Soluções'}
       </span>

     
     </button>
   );
 }
 
 return (
 <button
 type={type}
 onClick={handleClick}
 >
 </button>
 );
};

export default ButtonCta;
