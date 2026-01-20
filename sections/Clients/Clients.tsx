import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
 
import TestimonialCard from '../../components/ui/TestimonialCard';
import ButtonCta from '../../components/ui/ButtonCta';
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
 className="w-full py-12 md:py-20 transition-colors"
 style={{ backgroundColor: colors.background.dark }}
 >
 <div className="px-8 md:px-16 lg:px-24">
 <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
 
 {/* Layout dividido: Título à esquerda, Cards à direita */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
 
 {/* Lado Esquerdo - Título e Subtítulo */}
 <div className="flex flex-col justify-center">
 <motion.div 
   className="mb-6 flex items-center gap-2 px-3 py-1.5 backdrop-blur-md border w-fit"
   style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: colors.neutral.borderLight, borderRadius: '5px' }}
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
   <span className="text-xs md:text-sm font-regular whitespace-nowrap" style={{ color: colors.text.light }}>
     Depoimentos
   </span>
 </motion.div>
 
 <motion.h2 
   className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4"
   style={{ color: colors.text.light }}
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
 >
 A visão de quem trabalha conosco
 </motion.h2>
 
 <motion.p 
   className="text-lg leading-relaxed"
   style={{ color: colors.text.light, opacity: 0.7 }}
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
 >
 Decisões, processos e resultados contados por nossos clientes.
 </motion.p>
 </div>

 {/* Lado Direito - Grid de Cards (2 linhas x 3 colunas) */}
 <motion.div
   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
   initial={{ opacity: 0, y: 30 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
   transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
 >
 <TestimonialCard 
   name="Carlos Henrique" 
   location="São Paulo, SP"
   text="A Wefronti transformou completamente nossa visão em realidade. O app desenvolvido superou todas as expectativas." 
 />
 <TestimonialCard 
   name="Mariana Costa" 
   location="Rio de Janeiro, RJ"
   text="O e-commerce desenvolvido superou nossas expectativas. A experiência do usuário é impecável." 
 />
 <TestimonialCard 
   name="Projeto Confidencial" 
   location={null}
   text="Equipe extremamente profissional e dedicada. Transformaram nossa ideia em um SaaS completo e escalável." 
 />
 <TestimonialCard 
   name="Julia Santos" 
   location="Florianópolis, SC"
   text="A landing page ficou incrível! O design moderno nos ajudou a converter muito mais leads." 
 />
 <TestimonialCard 
   name="Projeto Confidencial" 
   location={null}
   text="Desenvolvimento impecável. Seguiram todas as melhores práticas de segurança e a integração com APIs foi perfeita." 
 />
 <TestimonialCard 
   name="André Ferreira" 
   location="Belo Horizonte, MG"
   text="Superaram nossas expectativas em todos os aspectos. Entrega no prazo e qualidade excepcional." 
 />
 </motion.div>

 </div>
 </div>
 </div>

 {/* CTA container: text left, button right (responsive) */}
 <div className="mt-12 px-8 md:px-16 lg:px-24">
   <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
     <div className="w-full border p-6 flex flex-col md:flex-row items-center justify-between gap-4"
       style={{ borderColor: colors.neutral.borderLight, borderRadius: '5px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
       <p className="text-lg md:text-xl font-medium" style={{ color: colors.text.light }}>
         Faça sua inscrição gratuitamente e dê início à sua jornada!
       </p>
       <div className="w-full md:w-auto flex justify-center md:justify-end">
         <ButtonCta label="Inscreva-se" variant="gradient" />
       </div>
     </div>
   </div>
 </div>
 </section>
 );
};

export default Clients;
