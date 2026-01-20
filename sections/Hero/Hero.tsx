import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { colors } from '../../styles/colors';

const ServicesCarousel = dynamic(() => import('../../sections/ServicesCarousel'), { ssr: false });

const Hero: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasEntered) return;
    let cancelled = false;
    let obs: IntersectionObserver | null = null;

    obs = new IntersectionObserver((([entry]) => {
      if (entry.isIntersecting && !cancelled) {
        setHasEntered(true);
        if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
      }
    }) as IntersectionObserverCallback, { threshold: 0.2, rootMargin: '0px' });

    if (sectionRef.current && obs) obs.observe(sectionRef.current);

    return () => {
      cancelled = true;
      if (obs && sectionRef.current) obs.unobserve(sectionRef.current);
    };
  }, [hasEntered]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="w-full relative overflow-hidden"
      style={{ 
        minHeight: '100vh',
        paddingTop: '100px',
        backgroundColor: colors.background.dark,
        zIndex: 0
      }}
    >

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-light leading-[1.2] mb-8 text-left"
            style={{ color: colors.text.light }}
          >
            Desenvolvemos seu <span style={{ color: colors.purple.tertiary }}>produto/projeto</span> com o melhor da tecnologia e Inteligência Artificial
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl leading-relaxed font-light mb-12 text-left"
            style={{ color: colors.text.light, opacity: 0.8 }}
          >
            Da presença digital a plataformas completas, criamos soluções tecnológicas robustas, seguras e escaláveis, projetadas para sustentar a operação, reduzir riscos e impulsionar o crescimento do negócio.
          </motion.h2>

          {/* Services Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Service 1 */}
            <div 
              className="rounded-lg p-6 flex flex-col justify-between min-h-[140px]"
              style={{ border: `1px solid ${colors.neutral.borderLight}`, background: colors.background.transparent }}
            >
              <h3 className="text-base md:text-lg font-normal leading-tight" style={{ color: colors.text.light }}>
                Criação de Sites para Startups e Grandes Corporações
              </h3>
            </div>

            {/* Service 2 */}
            <div 
              className="rounded-lg p-6 flex flex-col justify-between min-h-[140px]"
              style={{ border: `1px solid ${colors.neutral.borderLight}`, background: colors.background.transparent }}
            >
              <h3 className="text-base md:text-lg font-normal leading-tight" style={{ color: colors.text.light }}>
                Design de Interfaces para Aplicativos e Sistemas
              </h3>
            </div>

            {/* Service 3 */}
            <div 
              className="rounded-lg p-6 flex flex-col justify-between min-h-[140px]"
              style={{ border: `1px solid ${colors.neutral.borderLight}`, background: colors.background.transparent }}
            >
              <h3 className="text-base md:text-lg font-normal leading-tight" style={{ color: colors.text.light }}>
                Desenvolvimento Webflow, Framer e YCode
              </h3>
            </div>

            {/* Service 4 */}
            <div 
              className="rounded-lg p-6 flex flex-col justify-between min-h-[140px]"
              style={{ border: `1px solid ${colors.neutral.borderLight}`, background: colors.background.transparent }}
            >
              <h3 className="text-base md:text-lg font-normal leading-tight" style={{ color: colors.text.light }}>
                Parceria Estratégica para Produtos Digitais
              </h3>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Services carousel positioned at the bottom of the hero */}
      <div className="absolute bottom-0 left-0 w-full z-[20]">
        <ServicesCarousel />
      </div>
    </section>
  );
};

export default Hero;
