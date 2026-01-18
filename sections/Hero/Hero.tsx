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
      id="section-0"
      className="w-full relative overflow-hidden"
      style={{ 
        minHeight: '100vh',
        backgroundColor: colors.background.dark,
        backgroundImage: 'url(/images/site/background-site-wefronti.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-8 md:px-16 lg:px-24">
        <div className="w-full max-w-3xl md:max-w-6xl mx-auto">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-light leading-[1.1] mb-8 text-left md:text-center"
            style={{ color: colors.primary.white }}
          >
            Um time experiente pronto para <span style={{ color: colors.purple.tertiary }}>desenvolver seu produto</span>
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl leading-relaxed font-light mb-12 text-left md:text-center max-w-3xl mx-auto"
            style={{ color: colors.text.light, opacity: 0.9 }}
          >
            Da presença digital a plataformas completas, criamos soluções tecnológicas robustas, seguras e escaláveis, projetadas para sustentar a operação, reduzir riscos e impulsionar o crescimento do negócio.
          </motion.h2>

          {/* Cards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
            className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto"
          >
            {/* Card 1 */}
            <div 
              className="flex-1 group cursor-pointer rounded-3xl p-5 transition-transform duration-300 hover:scale-[1.02]"
              style={{ background: colors.purple.tertiary }}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.primary.white }}>
                  Iniciar um projeto
                </h3>
                <ArrowUpRight 
                  size={22} 
                  color={colors.primary.white} 
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" 
                />
              </div>
              <p className="text-base font-normal text-left" style={{ color: colors.primary.white, opacity: 0.7 }}>
                Fale com nosso time e vamos construir algo incrível juntos
              </p>
            </div>

            {/* Card 2 */}
            <div 
              className="flex-1 group cursor-pointer rounded-3xl p-5 transition-transform duration-300 hover:scale-[1.02]"
              style={{ border: `1px solid ${colors.neutral.borderLight}`, background: colors.background.transparent }}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.primary.white }}>
                  Casos de sucesso
                </h3>
                <ArrowUpRight 
                  size={22} 
                  color={colors.primary.white} 
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0" 
                />
              </div>
              <p className="text-base font-normal text-left" style={{ color: colors.primary.white, opacity: 0.7 }}>
                Confira como ajudamos outras empresas a crescerem
              </p>
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
