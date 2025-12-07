import React from 'react';
import { colors } from '../../styles/colors';

interface BadgeProps {
 text: string;
 icon?: 'star' | 'rocket' | 'sparkles' | 'heart' | 'trophy' | 'help';
}

const Badge: React.FC<BadgeProps> = ({ text, icon = 'star' }) => {
	return (
 <div 
 className="inline-flex items-center gap-1 px-3 py-2 text-medium font-medium transition-colors w-fit"
 style={{ 
 borderRadius: '7px',
 // Use gradientOne (brand) with subtle alpha for background/border to replace blueColor
 backgroundColor: 'rgba(149,160,255,0.09)',
 color: colors.gradientOne,
 border: `1px solid rgba(149,160,255,0.19)`,
 maxWidth: 'fit-content'
 }}
 >
 {icon === 'star' && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
 </svg>
 )}
 {icon === 'rocket' && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
 <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
 <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
 </svg>
 )}
 {icon === 'heart' && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
 </svg>
 )}
 {icon === 'trophy' && (
 <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
 <circle cx="12" cy="8" r="6"/>
 <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
 </svg>
 )}
 {icon === 'help' && (
 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
 <circle cx="12" cy="12" r="10"/>
 <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
 <circle cx="12" cy="17" r="1" fill="white"/>
 </svg>
 )}
 <span>{text}</span>
 </div>
 );
};

export default Badge;
