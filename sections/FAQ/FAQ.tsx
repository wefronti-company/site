import React from 'react';
import Badge from '../../components/ui/Badge';
import ButtonCta from '../../components/ui/ButtonCta';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { ptBR } from '../../locales/pt-BR';
import { colors } from '../../styles/colors';

const FAQ: React.FC = () => {
 const [openIndex, setOpenIndex] = React.useState<number | null>(0);
 const t = ptBR;

 const toggleFAQ = (index: number) => {
 setOpenIndex(openIndex === index ? null : index);
 };

 return (
 <section 
 id="faq" 
 className="w-full py-20 md:py-0 md:h-screen md:w-screen md:flex md:items-center transition-colors relative overflow-hidden"
 style={{ backgroundColor: colors.blackColor }}
 >
 <div className="px-4 md:px-8 lg:px-16 relative z-10 w-full">
 <div className="w-full max-w-[1200px] mx-auto">
 
 {/* Layout: Título à esquerda, Accordion à direita */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
 
 {/* Coluna Esquerda - Título */}
 <div className="lg:col-span-4">
 <h2 
 className="text-4xl md:text-5xl lg:text-6xl font-medium"
 style={{ color: colors.whiteColor }}
 >
 {t.faq.title}
 </h2>
 </div>

 {/* Coluna Direita - Accordion */}
 <div className="lg:col-span-8 space-y-4">
 {t.faq.items.map((faq, index) => (
 <div
 key={index}
 className="border transition-colors"
 style={{
 borderColor: colors.borderDark,
 borderRadius: '7px',
 backgroundColor: colors.blackColor,
 }}
 >
 {/* Pergunta */}
 <button
 onClick={() => toggleFAQ(index)}
 className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:opacity-80"
 >
 <span 
 className="text-base md:text-lg font-medium pr-4"
 style={{ color: colors.whiteColor }}
 >
 {faq.question}
 </span>
 <svg
 width="24"
 height="24"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 className={`flex-shrink-0 transition-transform duration-300 ${
 openIndex === index ? 'rotate-180' : ''
 }`}
 style={{ color: colors.whiteColor }}
 >
 <polyline
 points="6 9 12 15 18 9"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 />
 </svg>
 </button>


 <div
 className="overflow-hidden transition-all duration-300"
 style={{
 maxHeight: openIndex === index ? '500px' : '0',
 opacity: openIndex === index ? 1 : 0,
 }}
 >
 <div className="px-6 pb-5">
 <p 
 className="text-base leading-relaxed"
 style={{ color: colors.whiteColor, opacity: 0.8 }}
 >
 {faq.answer}
 </p>
 </div>
 </div>
 </div>
 ))}
 </div>

 </div>

 {/* Call to Action */}
 
 </div>
 </div>
 </section>
 );
};

export default FAQ;
