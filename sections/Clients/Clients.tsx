import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
 
import TestimonialCard from '../../components/ui/TestimonialCard';
import { colors } from '../../styles/colors';

// world map removed — we don't render a background there anymore

const Clients: React.FC = () => {
 const [isVisible, setIsVisible] = useState(false);
 const sectionRef = useRef<HTMLDivElement>(null);

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

 return (
 <section 
 ref={sectionRef}
 id="clients"
 className="w-full py-20 md:py-40 transition-colors"
 >
 {/* Cabeçalho */}
 <div className="px-4 md:px-8 lg:px-16">
 <div className="max-w-7xl mx-auto">
 <div className="text-left md:text-center mb-8 md:mb-12 lg:mb-14 flex flex-col items-start md:items-center">
 <motion.div 
   className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
 >
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
     <defs>
       <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
         <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
         <stop offset="100%" style={{ stopColor: colors.gradientTwo }} />
       </linearGradient>
     </defs>
     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="url(#heartGradient)"/>
   </svg>
   <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
     Depoimentos
   </span>
 </motion.div>
 <motion.h2 
   className="text-4xl md:text-4xl lg:text-5xl font-medium mt-6 mb-4 bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
 >
 O que nossos clientes dizem sobre nós
 </motion.h2>
 <motion.p 
   className="text-lg text-gray-300 max-w-2xl md:mx-auto"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
 >
 Clientes satisfeitos ao redor do mundo, conectados por nossas soluções digitais.
 </motion.p>
 </div>
 </div>
 </div>

 {/* Depoimentos - Carrossel Infinito - Full Width */}
 <motion.div 
   className="mt-8 relative"
   initial={{ opacity: 0, y: 30 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
   transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
 >
 <div className="relative overflow-hidden">
 {/* Container do carrossel */}
 <div className="flex gap-6 animate-scroll">
 {/* Primeira cópia */}
 <TestimonialCard name="Carlos Henrique" role="CEO" company="TechFlow Solutions" text="A Wefronti transformou completamente nossa visão em realidade. O app desenvolvido superou todas as expectativas em funcionalidade e design." rating={5} image="/images/depoimento-1.webp" />
 <TestimonialCard name="Mariana Costa" role="Diretora de Marketing" company="Innovate Corp" text="O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês." rating={5} image="/images/depoimento-2.webp" />
 <TestimonialCard name="Roberto Almeida" role="Fundador" company="StartupXYZ" text="Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente." rating={5} image="/images/depoimento-3.webp" />
 <TestimonialCard name="Julia Santos" role="Gerente de Projetos" company="Digital Solutions" text="A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido." rating={5} image="/images/depoimento-4.webp" />
 <TestimonialCard name="André Ferreira" role="CTO" company="FinTech Pro" text="Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita." rating={5} image="/images/depoimento-5.webp" />
 {/* Segunda cópia - para loop infinito */}
 <TestimonialCard name="Carlos Henrique" role="CEO" company="TechFlow Solutions" text="A Wefronti transformou completamente nossa visão em realidade. O app desenvolvido superou todas as expectativas em funcionalidade e design." rating={5} image="/images/depoimento-1.webp" />
 <TestimonialCard name="Mariana Costa" role="Diretora de Marketing" company="Innovate Corp" text="O e-commerce desenvolvido superou todas as nossas expectativas. A experiência do usuário é impecável e as vendas aumentaram 150% no primeiro mês." rating={5} image="/images/depoimento-2.webp" />
 <TestimonialCard name="Roberto Almeida" role="Fundador" company="StartupXYZ" text="Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável. O suporte pós-entrega é excelente." rating={5} image="/images/depoimento-3.webp" />
 <TestimonialCard name="Julia Santos" role="Gerente de Projetos" company="Digital Solutions" text="A landing page ficou incrível! O design moderno e responsivo nos ajudou a converter muito mais leads. Processo de desenvolvimento foi muito fluido." rating={5} image="/images/depoimento-4.webp" />
 <TestimonialCard name="André Ferreira" role="CTO" company="FinTech Pro" text="Desenvolvimento impecável do nosso sistema financeiro. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita." rating={5} image="/images/depoimento-5.webp" />
 </div>
 </div>
 </motion.div>
 </section>
 );
};

export default Clients;
