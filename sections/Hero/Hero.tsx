import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ButtonCta from '../../components/ui/ButtonCta';
import { colors } from '../../styles/colors';
import { useMenu } from '../../components/layout/MenuContext';
// minimal hero variant

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { open: menuOpen, toggle: toggleMenu } = useMenu();

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
      style={{ height: '100vh', minHeight: '420px', backgroundColor: colors.background.dark }}
    >
     

      {/* Content */}
      <div className="relative z-[30] flex items-start justify-center h-full px-6 md:px-10 lg:px-16 pt-28 md:pt-12 pb-12 lg:py-20">
        
          <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 items-start gap-6 md:gap-12">
            {/* Left: oversized display heading */}
            <div className="md:col-span-8 flex items-start">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                className="display-heading text-white/95 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-400"
                style={{ WebkitTextStroke: '0px transparent' }}
              >
                Projetamos produtos com propósito, pronto para gerar receita
              </motion.h1>
            </div>

            {/* Right: compact copy, badges, CTA */}
            <div className="md:col-span-4 flex flex-col items-start justify-center gap-6 mt-6 md:mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="flex flex-wrap items-start gap-3"
              >
              

                

                

              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="text-left text-sm md:text-base text-white/85 max-w-[320px] leading-relaxed"
              >
                Desenvolvemos seu produto com o que há de melhor em tecnologia e inteligência artificial — do SaaS a sistemas web complexos.
              </motion.h2>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
                className="mt-2"
              >
                <ButtonCta label="Agendar" />
              </motion.div>
            </div>
          </div>
        </div>

      {/* Menu trigger — camuflado na lateral direita */}
      <div className="absolute right-6 top-8 md:top-1/2 md:-translate-y-1/2 z-40">
        <button
          onClick={() => toggleMenu()}
          aria-label="Abrir menu"
          className="flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 rounded-md"
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-sm md:text-base font-medium text-white">Menu</span>
          <motion.div
            animate={{ rotate: menuOpen ? 45 : 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="relative flex items-center justify-center"
            style={{ width: 18, height: 18 }}
          >
            <div style={{ position: 'absolute', width: 14, height: 2, backgroundColor: 'white', borderRadius: 2 }} />
            <div style={{ position: 'absolute', width: 2, height: 14, backgroundColor: 'white', borderRadius: 2 }} />
          </motion.div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
