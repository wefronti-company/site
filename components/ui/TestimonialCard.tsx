import React from 'react';
import Image from 'next/image';

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
 image,
}) => {
 return (
 <div
 className="flex-shrink-0 w-[350px] md:w-[400px] p-8 bg-gray-100 transition-colors"
 style={{
 border: `1px solid ${'#D1D5DB'}`,
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
 fill={index < rating ? '#3B82F6' : '#e5e7eb'}
 >
 <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
 </svg>
 ))}
 </div>

 {/* Texto do depoimento */}
 <p className="text-base text-gray-700 mb-6 leading-relaxed">
 "{text}"
 </p>

 {/* Informações do cliente */}
 <div className="border-t pt-4" style={{ borderColor: '#D1D5DB' }}>
 <div className="flex items-center gap-4">
 <div className="relative w-12 h-12 flex-shrink-0">
 <Image
 src={image}
 alt={name}
 fill
 className="object-cover"
 style={{ borderRadius: '50%' }}
 />
 </div>
 <div>
 <p className="font-medium text-gray-900">{name}</p>
 <p className="text-sm text-gray-600">
 {role} • {company}
 </p>
 </div>
 </div>
 </div>
 </div>
 );
};

export default TestimonialCard;
