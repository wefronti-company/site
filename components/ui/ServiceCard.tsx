import React from 'react';
import { colors } from '../../styles/colors';
import Badge from '../../components/ui/Badge';
import ButtonCta from '../../components/ui/ButtonCta';
import { useQuoteModal } from '../../contexts/QuoteModalContext';

interface ServiceCardProps {
 title: string;
 description: string;
 features: string[];
 timeline: string;
 price?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, features, timeline, price }) => {
 const { openModal } = useQuoteModal();

 return (
		<div
			className="flex flex-col gap-6 p-8 transition-all hover:scale-[1.02] duration-300"
			style={{
				borderRadius: '7px',
				backgroundColor: colors.colorGray,
				border: `1px solid ${colors.borderDark}`,
			}}
		>
			<h3 className="text-2xl md:text-2xl font-medium" style={{ color: colors.whiteColor }}>
 {title}
 </h3>
 
 <p className="text-base" style={{ color: colors.whiteColor }}>
 {description}
 </p>

 <div className="flex flex-col gap-3">
 {features.map((feature, index) => (
 <div key={index} className="flex items-start gap-3">
 <svg 
 width="20" 
 height="20" 
 viewBox="0 0 24 24" 
 fill="none" 
 className="flex-shrink-0 mt-0.5"
 style={{ color: colors.blueColor }}
 >
 <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
 <path 
 d="M9 12l2 2 4-4" 
 stroke="currentColor" 
 strokeWidth="2" 
 strokeLinecap="round" 
 strokeLinejoin="round"
 />
 </svg>
 <span className="text-sm md:text-base" style={{ color: colors.whiteColor }}>{feature}</span>
 </div>
 ))}
 </div>

 <div className="mt-auto pt-6 flex flex-col gap-4">
	 <div className="flex items-center gap-2 text-sm" style={{ color: colors.whiteColor }}>
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
 <circle cx="12" cy="12" r="10" strokeWidth="2"/>
 <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>
 <span>{timeline}</span>
 </div>
 
	  <ButtonCta label="Solicitar orçamento" variant="primary" />
 </div>
 </div>
 );
};

export default ServiceCard;
