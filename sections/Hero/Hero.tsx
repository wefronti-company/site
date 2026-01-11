import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { Boxes } from '../../components/ui/shadcn-io/background-boxes';
import { colors } from '../../styles/colors';
// minimal hero variant

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Anima quando a seção está visível (pelo menos 20% dela)
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2, // Trigger quando 20% da seção estiver visível
        rootMargin: '0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleNav = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  

  return (
    <section
      ref={sectionRef}
      id="section-0"
      className="w-full relative overflow-hidden"
      style={{ height: '90vh', minHeight: '420px', backgroundColor: colors.blackColor }}
    >
      {/* overlay - fundo escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-0" />

      {/* Background Boxes - na frente mas transparent para cliques */}
      <div className="absolute inset-0 w-full h-full z-[15] opacity-40 pointer-events-none">
        <Boxes />
      </div>

      {/* Content */}
      <div className="relative z-[30] flex items-center justify-center h-full px-6 md:px-10 lg:px-16 pt-40 pb-12 lg:py-90">
        
          <div className="w-full max-w-[1400px] mx-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-3 mb-4"
              >
                {/* Badge 1: Ideias que viram receita */}
                <div 
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '5px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    Ideias que viram receita
                  </span>
                </div>

                {/* Badge 2: Tecnologia que gera lucro */}
                <div 
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '5px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    Tecnologia que gera lucro
                  </span>
                </div>

                {/* Badge 3: Negócios que crescem */}
                <div 
                  className="flex items-center gap-2 px-4 py-2.5"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderRadius: '5px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    Negócios que crescem
                  </span>
                </div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium leading-tight max-w-[1200px] bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2"
              >
                Projetamos produtos com propósito, pronto para gerar receita
              </motion.h1>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="text-center text-sm md:text-lg text-white/90 max-w-[600px] mt-2 leading-relaxed"
              >
                Desenvolvemos seu produto com o melhor da tecnologia e inteligencia artificial, desde Saas, software á sistemas web complexos.
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="mt-6"
              >
                <ButtonCta label="Agendar uma reunião" />
              </motion.div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Hero;
