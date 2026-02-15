import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import ButtonCta from '../../components/ui/ButtonCta';
import Badge from '../../components/ui/Badge';

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

const { colors, spacing, fontSizes, radii } = theme;

const HERO_CHIPS: { label: string; icon: string }[] = [
  { label: 'Site rápido e seguro', icon: '/images/icons/seguro.png' },
  { label: 'Design de alto nível', icon: '/images/icons/design.png' },
  { label: 'Focado em conversão', icon: '/images/icons/conversao.png' },
  { label: 'Otimizado para Google', icon: '/images/icons/google.png' },
];

const heroSectionStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: spacing[10],
  backgroundColor: colors.background.dark,
  backgroundImage: "url('/images/brand/background.webp')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const heroContentStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  textAlign: 'center',
};

const heroTitleStyle: React.CSSProperties = {
  fontWeight: 200,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(3rem, 6.5vw, 4.5rem)',
  color: colors.text.light,
  margin: 0,
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  lineHeight: 1.45,
  color: colors.text.light,
  opacity: 0.92,
  margin: 0,
};

const chipsGridStyle: React.CSSProperties = {
  display: 'flex',
  gridTemplateRows: '1fr 1fr',
  gap: spacing[6],
  justifyContent: 'center',
};

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 200,
  color: colors.text.light,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: radii.full,
  whiteSpace: 'nowrap',
};

const chipIconStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  objectFit: 'contain',
  flexShrink: 0,
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
      <div style={heroContentStyle}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
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
          Transforme seu site em uma máquina de vendas. Atraia clientes qualificados e converta visitantes em negócios reais.
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          style={heroSubtitleStyle}
        >
          Especialistas em criar presença digital única para empresas: sites que ajudam a crescer e se destacar no mercado.
        </motion.h2>

        <motion.div
          style={chipsGridStyle}
          initial={{ opacity: 0, y: 12 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
        >
          {HERO_CHIPS.map(({ label, icon }, i) => (
            <span key={i} style={chipStyle}>
              <img src={icon} alt="" style={chipIconStyle} />
              {label}
            </span>
          ))}
        </motion.div>

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
    </section>
  );
};

export default Hero;
