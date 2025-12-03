import React from 'react';
 
import Badge from '../../components/ui/Badge';
import TestimonialCard from '../../components/ui/TestimonialCard';
import { ptBR } from '../../locales/pt-BR';
import { colors } from '../../styles/colors';

// world map removed — we don't render a background there anymore

const Clients: React.FC = () => {
	const t = ptBR;

 return (
 <section 
 id="clients"
 className="w-full py-20 transition-colors border-b"
 style={{
	 borderBottomColor: colors.borderDark
 }}
 >
 {/* Cabeçalho */}
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">
 <div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14">
 <Badge icon="heart" text={t.clients.badge} />
 <h2 className="text-4xl md:text-4xl lg:text-5xl font-medium text-white mt-6 mb-4">
 {t.clients.title}
 </h2>
 <p className="text-lg text-gray-300 max-w-2xl md:mx-auto">
 {t.clients.subtitle}
 </p>
 </div>
 </div>
 </div>

 {/* Depoimentos - Carrossel Infinito - Full Width */}
 <div className="mt-8 relative">
 <div className="relative overflow-hidden">
 {/* Container do carrossel */}
 <div className="flex gap-6 animate-scroll">
 {/* Primeira cópia */}
 {t.clients.testimonials.map((testimonial, index) => (
 <TestimonialCard key={`first-${index}`} {...testimonial} rating={5} image={`/images/depoimento-${index + 1}.webp`} />
 ))}
 {/* Segunda cópia - para loop infinito */}
 {t.clients.testimonials.map((testimonial, index) => (
 <TestimonialCard key={`second-${index}`} {...testimonial} rating={5} image={`/images/depoimento-${index + 1}.webp`} />
 ))}
 </div>
 </div>
 </div>
 </section>
 );
};

export default Clients;
