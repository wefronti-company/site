import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
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
 <div className="flex flex-col justify-start">
 <motion.div 
   className="mb-6 flex items-center gap-2 px-3 py-1.5 rounded border border-white/10 w-fit"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
 >
   <Users className="w-4 h-4" style={{ color: colors.icons.light }} />
   <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
     Nossos parceiros
   </span>
 </motion.div>
 
 <motion.h2 
   className="text-4xl md:text-4xl lg:text-5xl font-regular mb-4"
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
 >
   <span style={{ color: colors.text.light }}>A visão de quem<br /></span>
   <span style={{ color: colors.text.dark }}>trabalha conosco</span>
 </motion.h2>
 
 <motion.p 
   className="text-lg leading-relaxed mb-8"
   style={{ color: colors.text.light, opacity: 0.7 }}
   initial={{ opacity: 0, y: 20 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
   transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
 >
 Decisões, processos e resultados contados por nossos clientes.
 </motion.p>

 {/* Circular badge with rotating icon */}
 <motion.div
   initial={{ opacity: 0, scale: 0.8 }}
   animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
   transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
 >
   <motion.div
     animate={{ rotate: -360 }}
     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
     className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center"
   >
     <img 
       src="/images/icons/icon-circle.png" 
       alt="Badge" 
       className="w-full h-full"
     />
   </motion.div>
 </motion.div>
 </div>

 {/* Lado Direito - Grid de Cards (2 linhas x 3 colunas) */}
 <motion.div
   className="grid grid-cols-1 sm:grid-cols-2 gap-4"
   initial={{ opacity: 0, y: 30 }}
   animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
   transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
 >
 <TestimonialCard 
   name="Carlos Eduardo" 
   location="São Paulo, SP"
   text="O que nos chamou atenção foi a postura. Desde a primeira conversa ficou claro que eles entendem o impacto de um sistema no negócio. Não foi um projeto rápido, foi um trabalho responsável." 
 />
 <TestimonialCard 
   name="Mariana Lopes" 
   location="Rio de Janeiro, RJ"
   text="Já trabalhamos com outras empresas de tecnologia, mas a diferença aqui foi o processo. Tudo foi bem alinhado desde o início, sem promessas irreais. Isso nos deu segurança para seguir." 
 />
 <TestimonialCard 
   name="Projeto Confidencial" 
   location={null}
   text="Gostei da forma direta como as coisas foram conduzidas. Sem discurso técnico desnecessário, sem enrolação. Isso é raro no mercado." 
 />
 <TestimonialCard 
   name="Fernanda Ribeiro" 
   location="Belo Horizonte, MG"
   text="Eu não procurava alguém para programar. Procurava alguém para assumir responsabilidade junto comigo. Foi exatamente isso que encontrei." 
 />
 </motion.div>

 </div>
 </div>
 </div>

 {/* CTA container: text left, button right (responsive) */}
 <div className="mt-12 px-8 md:px-16 lg:px-24">
   <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
     <div className="w-full border p-6 flex flex-col md:flex-row items-center justify-between gap-4"
       style={{ border: `10px solid ${colors.neutral.borderLight}`, borderRadius: '4px', backgroundColor: '#ffffff' }}>
       <p className="text-lg md:text-xl font-medium text-center md:text-left" style={{ color: '#000000' }}>
         Projetos sérios começam com boas conversas.
       </p>
       <div className="w-full md:w-auto flex justify-center md:justify-end">
         <a
           href="#contato"
           onClick={(e) => {
             e.preventDefault();
             const ctaSection = document.getElementById('contato');
             if (ctaSection) {
               ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             } else {
               window.location.href = '/#contato';
             }
           }}
           className="inline-flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 group"
           style={{
             backgroundColor: colors.neutral.gray,
             color: colors.text.light,
             borderRadius: '4px',
             padding: '12px 24px',
             border: 'none',
             cursor: 'pointer',
             textDecoration: 'none'
           }}
         >
           <span className="text-base font-medium">Iniciar</span>
           <ArrowRight 
             size={18} 
             color={colors.text.light}
             className="transition-transform duration-300 group-hover:rotate-45" 
           />
         </a>
       </div>
     </div>
   </div>
 </div>
 </section>
 );
};

export default Clients;
