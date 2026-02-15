import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../styles/colors';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';

const CONTACT_SECTION_ID = 'contato';
const HEADER_OFFSET = 100;

const scrollToSection = (id: string) => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const targetTop = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  } else {
    window.location.href = `/#${id}`;
  }
};

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
      className="w-full relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        backgroundColor: colors.background.dark,
        backgroundImage: "url('/images/brand/background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }}
    >
      <div className="relative z-20 flex items-center min-h-[calc(100vh-100px)] w-full px-4 md:px-8 lg:px-12">
        <div className="w-full max-w-3xl md:max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          {/* Coluna esquerda: conteúdo alinhado à esquerda */}
          <div className="w-full lg:flex-1 text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              className="mb-6"
            >
              <Badge segmentLabel="Sites profissionais">
                Sob medida para sua empresa
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] mb-6"
              style={{ color: colors.text.light }}
            >
              Seu site não deve apenas existir. Ele deve vender.
              {' '}
              <span style={{ color: colors.text.dark }}>E gerar lucro para sua empresa.</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
              className="text-lg md:text-xl lg:text-2xl leading-relaxed font-light mb-10 max-w-2xl"
              style={{ color: colors.text.light, opacity: 0.9 }}
            >
              Especialistas em criar presença digital única para empresas: sites que ajudam a crescer e se destacar no mercado.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            >
              <ButtonCta onClick={() => scrollToSection(CONTACT_SECTION_ID)}>
                Solicitar orçamento
              </ButtonCta>
            </motion.div>
          </div>

          {/* Coluna direita: espaço para imagem */}
          <div className="w-full lg:flex-1 flex items-center justify-center lg:justify-end">
            <div
              className="w-full max-w-md aspect-square rounded-lg overflow-hidden bg-black/20"
              style={{ border: `1px solid ${colors.neutral.borderDark}` }}
              aria-hidden
            >
              {/* Coloque sua imagem aqui, ex: <Image src="..." ... /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
