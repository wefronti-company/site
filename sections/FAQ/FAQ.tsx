import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import ButtonCta from '../../components/ui/ButtonCta';
import { colors } from '../../styles/colors';

const FAQ: React.FC = () => {
 const [openIndex, setOpenIndex] = React.useState<number | null>(0);
 const [isVisible, setIsVisible] = useState(false);
 const sectionRef = useRef<HTMLElement>(null);

 useEffect(() => {
   const observer = new IntersectionObserver(
     ([entry]) => {
       if (entry.isIntersecting) {
         setIsVisible(true);
       } else {
         setIsVisible(false);
       }
     },
     { threshold: 0.2 }
   );

   if (sectionRef.current) {
     observer.observe(sectionRef.current);
   }

   return () => observer.disconnect();
 }, []);

 const toggleFAQ = (index: number) => {
 setOpenIndex(openIndex === index ? null : index);
 };

 return (
 <section 
 ref={sectionRef}
 id="faq" 
 className="w-full py-20 md:py-32 md:h-screen md:w-screen md:flex md:items-center transition-colors relative overflow-hidden pb-32 md:pb-40"
 style={{ backgroundColor: colors.blackColor }}
 >
 {/* Background Boxes */}
 <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
  
 </div>

 <div className="px-4 md:px-8 lg:px-16 relative z-10 w-full">
 <div className="w-full max-w-[1200px] mx-auto">
 
 {/* Layout: Título à esquerda, Accordion à direita */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
 
 {/* Coluna Esquerda - Título */}
 <div className="lg:col-span-4">
 <motion.div 
   className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 w-fit"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
 >
   <HelpCircle className="w-4 h-4" style={{ color: colors.purple.tertiary }} />
   <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
     Dúvidas
   </span>
 </motion.div>
 <motion.h2 
   className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
 >
   <span style={{ color: colors.text.light }}>Perguntas </span>
   <span style={{ color: colors.purple.tertiary }}>Frequentes</span>
 </motion.h2>
 <motion.p
   className="text-lg text-gray-300 leading-relaxed"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
 >
   Tire suas dúvidas sobre nossos serviços e processos.
 </motion.p>
 </div>

 {/* Coluna Direita - Accordion */}
 <motion.div 
   className="lg:col-span-8 space-y-4"
   initial={{ opacity: 0, y: 30 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
   transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
 >
 {[
 {
 question: 'Quanto tempo leva para desenvolver um projeto?',
 answer: 'O prazo varia conforme a complexidade. sites e ecommerces ficam prontos entre 2 a 6 semanas. Sistemas, SaaS e demais projetos/produtos dependem do tamanho. Após uma reunião inicial, apresentamos um cronograma detalhado com todas as etapas e prazos.'
 },
 {
 question: 'Qual o investimento necessário para um projeto?',
 answer: 'O investimento varia de acordo com o escopo do projeto. Sites e ecommerces começam a partir de R$ 3.500,00. Sistemas, SaaS e e demais projetos/produtos têm valores personalizados baseados nas funcionalidades necessárias. Oferecemos propostas transparentes e detalhadas antes de iniciar.'
 },
 {
 question: 'Vocês oferecem suporte após a entrega?',
 answer: 'Sim! Oferecemos 30 dias de garantia gratuita para após a conclusão/entrega do projeto correções de bugs. Também disponibilizamos planos de manutenção mensal que incluem updates, monitoramento, backups, suporte técnico e pequenas melhorias. O suporte garante que seu projeto continue funcionando perfeitamente.'
 },
 {
 question: 'Posso acompanhar o desenvolvimento do projeto?',
 answer: 'Absolutamente! Trabalhamos com metodologia ágil (Scrum) com sprints de 2 semanas. Você terá acesso a reuniões de planejamento, reviews semanais, ambiente de homologação para testes e comunicação direta via WhatsApp. Total transparência em todas as etapas.'
 },
 {
 question: 'Quais tecnologias vocês utilizam?',
 answer: 'Utilizamos as tecnologias mais modernas e confiáveis do mercado. Frontend: React, Next.js, TypeScript, Tailwind CSS. Backend: Node.js, Laravel, PostgreSQL. Cloud: AWS, Vercel, Google Cloud. Escolhemos a stack ideal para cada projeto.'
 },
 {
 question: 'Como garantem a qualidade e segurança do código?',
 answer: 'Aplicamos as melhores práticas de engenharia de software: code review em todo código, testes automatizados, integração contínua, monitoramento de performance. Na segurança, implementamos autenticação robusta, criptografia de dados, proteção contra vulnerabilidades comuns e conformidade com LGPD. Qualidade não é negociável.'
 }
 ].map((faq, index) => (
 <div
 key={index}
 className="border transition-colors"
 style={{
 borderColor: colors.borderDark,
 borderRadius: '4px',
 backgroundColor: colors.accordeonColor,
 }}
 >
 {/* Pergunta */}
 <button
 onClick={() => toggleFAQ(index)}
 className="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-200 hover:opacity-80"
 >
 <span 
 className="text-base md:text-lg font-regular pr-4"
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
 className="overflow-hidden transition-all duration-600"
 style={{
 maxHeight: openIndex === index ? '500px' : '0',
 opacity: openIndex === index ? 1 : 0,
 transitionDuration: '600ms',
 }}
 >
 <div className="px-6 pb-5">
 <p 
 className="text-regular leading-relaxed"
 style={{ color: colors.whiteColor, opacity: 0.8 }}
 >
 {faq.answer}
 </p>
 </div>
 </div>
 </div>
 ))}
 </motion.div>

 </div>

 {/* Call to Action */}
 
 </div>
 </div>
 </section>
 );
};

export default FAQ;
