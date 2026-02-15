import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';
import Logo from '../../components/ui/Logo';

const CONTACT_SECTION_ID = 'contato';
const SCROLL_OFFSET = 24;

const scrollToSection = (id: string) => {
  if (typeof window === 'undefined') return;
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const targetTop = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  } else {
    window.location.href = `/#${id}`;
  }
};

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const heroSectionStyle: React.CSSProperties = {
  minHeight: '100vh',
  paddingTop: spacing[8],
  paddingLeft: spacing[10],
  paddingRight: spacing[10],
  backgroundColor: colors.background.dark,
  backgroundImage: "url('/images/brand/background.webp')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const heroInnerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: containerMaxWidth.header,
  margin: '0 auto',
};

const heroContentStyle: React.CSSProperties = {
  maxWidth: 680,
};

const heroTitleStyle: React.CSSProperties = {
  fontWeight: 200,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(2.25rem, 5vw, 4rem)',
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[6],
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
    <section ref={sectionRef} id="hero" style={heroSectionStyle}>
      <div style={heroInnerStyle}>
        <div style={heroContentStyle}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0 }}
            style={{ marginBottom: spacing[8] }}
          >
            <Logo href="/" ariaLabel="Ir para a página inicial" isDark={false} style={logoStyle} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            style={{ marginBottom: spacing[6] }}
          >
            <Badge segmentLabel="Sites profissionais">
              Sob medida para sua empresa
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            style={heroTitleStyle}
          >
            Trasforme seu site em uma máquina de vendas e aquisição de clientes
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
            style={heroSubtitleStyle}
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
      </div>
    </section>
  );
};

const logoStyle: React.CSSProperties = {
  display: 'inline-block',
  objectFit: 'contain',
  maxHeight: 40,
  maxWidth: 140,
};

export default Hero;
