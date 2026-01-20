import React from 'react';
import { colors } from '../../styles/colors';

interface TestimonialCardProps {
 name: string;
 location: string | null;
 text: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
 name,
 location,
 text,
}) => {
	return (
		<div
			className="p-6 transition-colors border"
			style={{
				backgroundColor: colors.background.transparent,
				borderColor: colors.neutral.borderLight,
				borderRadius: '4px',
			}}
		>
 {/* Texto do depoimento */}
		<p className="text-sm leading-relaxed mb-4" style={{ color: colors.text.light, opacity: 0.8 }}>
			"{text}"
		</p>

 {/* Informações do cliente */}
	<div className="border-t pt-3" style={{ borderColor: colors.neutral.borderLight }}>
			<p className="font-medium text-sm" style={{ color: colors.text.light }}>{name}</p>
      {location && (
        <p className="text-xs mt-1" style={{ color: colors.text.light, opacity: 0.6 }}>{location}</p>
      )}
 </div>
 </div>
 );
};

export default TestimonialCard;
