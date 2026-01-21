import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowUpRight, Globe, Server, Link2, BarChart3 } from 'lucide-react';
import { colors } from '../../styles/colors';
import ScrollIndicator from '../../components/ui/ScrollIndicator';

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
        <div className="w-full max-w-3xl md:max-w-6xl mx-auto relative">
          
          {/* Circular badge with rotating icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={hasEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="absolute -top-12 md:-top-16 right-0 md:right-40 lg:right-64 z-30"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-32 h-32 flex items-center justify-center"
            >
              <img 
                src="/images/icons/icon-circle.png" 
                alt="Badge" 
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="text-4xl md:text-4xl lg:text-5xl xl:text-7xl font-light leading-[1.2] mb-8 text-left"
            style={{ color: colors.text.light }}
          >
            Desenvolvemos seu <span style={{ color: colors.text.dark }}>produto/projeto</span> com o melhor da tecnologia e Inteligência Artificial
          </motion.h1>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl leading-relaxed font-light mb-12 text-left"
            style={{ color: colors.text.light, opacity: 0.8 }}
          >
            Soluções sob medida para empresas que buscam eficiência operacional, segurança e escalabilidade real
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
              className="rounded-lg p-6 flex flex-col gap-3"
              style={{ borderRadius: '0.5rem', border: `1px solid ${colors.neutral.borderDark}` }}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 flex-shrink-0" style={{ color: colors.icons.light }} />
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.text.light }}>
                  Sites e Ecommerce
                </h3>
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: colors.text.light, opacity: 0.7 }}>
                Plataformas web otimizadas para conversão, SEO e performance, com arquitetura escalável para suportar crescimento
              </p>
            </div>

            {/* Service 2 */}
            <div 
              className="rounded-lg p-6 flex flex-col gap-3"
              style={{ borderRadius: '0.5rem', border: `1px solid ${colors.neutral.borderDark}` }}
            >
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 flex-shrink-0" style={{ color: colors.icons.light }} />
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.text.light }}>
                  Sistemas
                </h3>
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: colors.text.light, opacity: 0.7 }}>
                Software corporativo customizado para gestão, automação de processos e otimização operacional do seu negócio
              </p>
            </div>

            {/* Service 3 */}
            <div 
              className="rounded-lg p-6 flex flex-col gap-3"
              style={{ borderRadius: '0.5rem', border: `1px solid ${colors.neutral.borderDark}` }}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 flex-shrink-0" style={{ color: colors.icons.light }} />
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.text.light }}>
                  API e Integrações
                </h3>
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: colors.text.light, opacity: 0.7 }}>
                Desenvolvimento de APIs RESTful e integração entre sistemas para unificar dados e automatizar fluxos
              </p>
            </div>

            {/* Service 4 */}
            <div 
              className="rounded-lg p-6 flex flex-col gap-3"
              style={{ borderRadius: '0.5rem', border: `1px solid ${colors.neutral.borderDark}` }}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 flex-shrink-0" style={{ color: colors.icons.light }} />
                <h3 className="text-lg md:text-xl font-medium" style={{ color: colors.text.light }}>
                  SaaS e Dashboards
                </h3>
              </div>
              <p className="text-sm font-light leading-relaxed" style={{ color: colors.text.light, opacity: 0.7 }}>
                Produtos digitais como serviço e painéis analíticos para visualização de dados e tomada de decisão estratégica
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
};

export default Hero;
