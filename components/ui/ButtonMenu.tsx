import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';
import { ArrowUpRight } from 'lucide-react';

interface ButtonMenuProps {
 label?: string;
 onClick?: () => void;
 variant?: 'primary' | 'secondary' | 'gradient';
 design?: 'default' | 'split';
 children?: React.ReactNode;
 type?: 'button' | 'submit';
 disabled?: boolean;
 className?: string; // optional to allow sizing from parent
}

const ButtonMenu: React.FC<ButtonMenuProps> = ({ 
 label, 
 onClick,
 variant = 'primary',
 // default to 'split' so it renders the pill in menus by default
 design = 'split',
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
 background: colors.purple.secondary,
 color: colors.primary.white
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
         className="inline-flex items-center h-10 px-6 text-[16px] font-medium"
         style={{
           background: colors.purple.tertiary,
           color: colors.whiteColor,
           borderRadius: '999px',
           paddingLeft: '0.75rem',
           paddingRight: '0.75rem'
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

export default ButtonMenu;
