import React from 'react';
import { colors } from '../../styles/colors';

interface TestimonialCardProps {
 name: string;
 role: string;
 company: string;
 text: string;
 rating: number;
 image: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
 name,
 role,
 company,
 text,
 rating,
}) => {
	return (
		<div
			className="flex-shrink-0 w-[350px] md:w-[400px] p-8 transition-colors border"
			style={{
				backgroundColor: colors.whiteColor,
				borderColor: colors.borderLight,
				borderRadius: '7px',
			}}
		>
 {/* Estrelas */}
	<div className="flex gap-1 mb-4">
 {[...Array(5)].map((_, index) => (
 <svg
 key={index}
 width="20"
 height="20"
 viewBox="0 0 24 24"
 fill={index < rating ? colors.starsColor : 'rgba(227, 194, 59, 1)'}
 >
 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
 </svg>
 ))}
 </div>

 {/* Texto do depoimento */}
		<p className="text-base mb-6 leading-relaxed" style={{ color: colors.blackColor }}>
			"{text}"
		</p>

 {/* Informações do cliente */}
	<div className="border-t pt-4" style={{ borderColor: colors.borderLight }}>
 <div>
			<p className="font-medium" style={{ color: colors.blackColor }}>{name}</p>
			<p className="text-sm" style={{ color: colors.blackColor, opacity: 0.7 }}>
 {role} • {company}
 </p>
 </div>
 </div>
 </div>
 );
};

export default TestimonialCard;
