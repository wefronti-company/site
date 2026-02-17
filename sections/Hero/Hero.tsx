import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const SPARKLE_COUNT = 85;

function useSparkles() {
  return useMemo(() => {
    return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
      const s1 = (i * 17 + 31) % 100;
      const s2 = (i * 7 + 41) % 100;
      const s3 = (i * 23 + 11) % 100;
      // Distribui mais no topo e nas laterais (fora da meia-lua na base)
      const left = 2 + (s1 * 0.96) % 96;
      const top = 4 + (s2 * 0.88) % 88;
      return {
        id: i,
        left,
        top,
        size: 1.5 + (s3 % 2), // 1.5–3.5px, mais delicados
        duration: 2 + (s1 % 4) * 0.5,
        delay: (s2 % 25) * 0.12,
      };
    });
  }, []);
}

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

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const HERO_CHIPS: { label: string; icon: string }[] = [
  { label: 'Site rápido e seguro', icon: '/images/icons/seguro.png' },
  { label: 'Design de alto nível', icon: '/images/icons/design.png' },
  { label: 'Focado em conversão', icon: '/images/icons/conversao.png' },
  { label: 'Otimizado para Google', icon: '/images/icons/google.png' },
];

const heroSectionStyleBase: React.CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  backgroundColor: colors.background.dark,
  backgroundImage: "url('/images/brand/background.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 25,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  borderBottomLeftRadius: 60,
  borderBottomRightRadius: 60,
};

// Meia-lua na base: brilhos só aparecem fora do círculo (circunferência do canto inferior esq → acima do H1 → canto inferior dir)
const SPARKLE_MASK_RADIUS = '58%'; // raio menor = arco mais baixo = brilhos visíveis mais perto/sobre o H1

const sparklesLayerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 1,
  maskImage: `radial-gradient(circle at 50% 100%, transparent 0, transparent ${SPARKLE_MASK_RADIUS}, black ${SPARKLE_MASK_RADIUS})`,
  WebkitMaskImage: `radial-gradient(circle at 50% 100%, transparent 0, transparent ${SPARKLE_MASK_RADIUS}, black ${SPARKLE_MASK_RADIUS})`,
  maskSize: '100% 100%',
  maskPosition: '0 0',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: '100% 100%',
  WebkitMaskPosition: '0 0',
  WebkitMaskRepeat: 'no-repeat',
};

const sparkleStyle = (
  left: number,
  top: number,
  size: number,
  duration: number,
  delay: number
): React.CSSProperties => ({
  position: 'absolute',
  left: `${left}%`,
  top: `${top}%`,
  width: size,
  height: size,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.92)',
  boxShadow: '0 0 8px rgba(255,255,255,0.7)',
  animation: `sparkle-twinkle ${duration}s ease-in-out ${delay}s infinite`,
});

const heroContentStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[10],
};

const heroTitleStyle: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  fontSize: 'clamp(3rem, 6.5vw, 5rem)',
  color: colors.text.light,
  margin: 0,
};

const heroSubtitleStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  fontWeight: 200,
  lineHeight: 1.45,
  color: colors.text.light,
  opacity: 0.92,
  margin: 0,
};


const chipStyleBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontWeight: 200,
  color: colors.text.light,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  whiteSpace: 'nowrap',
};

const chipIconStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  objectFit: 'contain',
  flexShrink: 0,
};

const Hero: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [hasEntered, setHasEntered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sparkles = useSparkles();

  const heroSectionStyle: React.CSSProperties = {
    ...heroSectionStyleBase,
    padding: isMd ? spacing[10] : spacing[6],
    alignItems: isMd ? 'center' : 'flex-start',
  };
  const heroContentStyle: React.CSSProperties = {
    ...heroContentStyleBase,
    alignItems: isMd ? 'center' : 'flex-start',
    textAlign: isMd ? 'center' : 'left',
  };
  const chipsGridStyle: React.CSSProperties = isMd
    ? {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        gap: spacing[6],
      }
    : {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing[3],
        justifyItems: 'start',
      };
  const chipStyle: React.CSSProperties = {
    ...chipStyleBase,
    fontSize: isMd ? fontSizes.sm : fontSizes.xs,
  };

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
      <div style={sparklesLayerStyle} aria-hidden="true">
        {sparkles.map((s) => (
          <span
            key={s.id}
            className="hero-sparkle"
            style={sparkleStyle(s.left, s.top, s.size, s.duration, s.delay)}
          />
        ))}
      </div>
      <div style={heroContentStyle}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          style={heroTitleStyle}
        >
          Transformamos seu site em uma máquina online de vendas
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
          style={heroSubtitleStyle}
        >
          Planejamento, tecnologia e otimização contínua para tornar seu site um verdadeiro canal de aquisição.
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
