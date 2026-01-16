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
       className={`inline-flex items-center gap-2 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
       style={{ border: 'none' }}
     >
       {/* Pill text (fixed height to match action) */}
       <span
         className="inline-flex items-center h-10 px-16 text-[18px] font-semibold"
         style={{
           background: colors.primary.white,
           color: colors.purple.secondary,
           borderRadius: '999px',
           
         }}
       >
         {children || label || 'Soluções'}
       </span>

       {/* Square/round action (same height) */}
       <span
         className="w-10 h-10 flex items-center justify-center rounded-md transition-transform duration-150"
         style={{ borderRadius: '4px', background: colors.purple.tertiary, color: colors.purple.secondary }}
       >
         <ArrowUpRight className="w-4 h-4" />
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
