import React from 'react';
import Image from 'next/image';
import { Zap, Shield, Headphones, TrendingUp, Star } from 'lucide-react';
import ButtonCta from '../../components/ui/ButtonCta';
import { theme } from '../../styles/theme';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const CARDS = [
  {
    title: 'Entregas no prazo',
    description: 'Cumprimos prazos acordados e mantemos você informado em cada etapa do projeto.',
    icon: Zap,
  },
  {
    title: 'Qualidade garantida',
    description: 'Código limpo, design profissional e suporte pós-entrega para garantir seu resultado.',
    icon: Star,
  },
  {
    title: 'Suporte dedicado',
    description: 'Comunicação direta e acompanhamento para que seu site funcione perfeitamente.',
    icon: Headphones,
  },
  {
    title: 'Resultados mensuráveis',
    description: 'Site preparado para analytics e conversões, para você acompanhar o retorno.',
    icon: TrendingUp,
  },
] as const;

const sectionStyle: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const parentWrapStyleBase: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  boxSizing: 'border-box',
  borderRadius: 30,
  backgroundColor: '#EBEBEB',
};

const logoBgStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
};

const badgeOuterStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: 6,
  borderRadius: 30,
  backgroundColor: '#171717',
  border: '1px solid rgba(0, 0, 0, 0.08)',
};

const badgeInnerStyle: React.CSSProperties = {
  padding: '4px 12px',
  borderRadius: 9999,
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: '#fff',
};

const badgeOuterTextStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: 'rgba(255, 255, 255, 0.9)',
  margin: 0,
};

const leftTitleStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: '#171717',
  margin: 0,
  paddingTop: spacing[8],
  marginBottom: spacing[4],
};

const leftDescStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: '#52525b',
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  borderRadius: 30,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: '#040404',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  padding: spacing[6],
};

const cardIconWrapStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginBottom: spacing[4],
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

const cardContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.55,
  color: colors.text.secondary,
  margin: 0,
};

const BenefitsSection: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const parentWrapStyle: React.CSSProperties = {
    ...parentWrapStyleBase,
    padding: isMd ? `${spacing[16]}px ${spacing[8]}px` : `${spacing[16]}px 16px`,
  };

  const layoutStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: isMd ? 'row' : 'column',
    gap: spacing[12],
    alignItems: isMd ? 'flex-start' : 'stretch',
  };

  const leftStyle: React.CSSProperties = {
    flex: isMd ? '0 0 40%' : '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isMd ? 'flex-start' : 'center',
    textAlign: isMd ? 'left' : 'center',
  };

  const gridStyle: React.CSSProperties = {
    flex: isMd ? '1 1 auto' : '1 1 auto',
    display: 'grid',
    gridTemplateColumns: isMd ? 'repeat(2, 1fr)' : '1fr',
    gap: spacing[6],
  };

  return (
    <section id="beneficios" style={sectionStyle} aria-labelledby="benefits-heading">
      <svg width={0} height={0} aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="benefits-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#49C0FF" />
            <stop offset="100%" stopColor="#0280FF" />
          </linearGradient>
        </defs>
      </svg>
      <div style={parentWrapStyle}>
        <div style={logoBgStyle} aria-hidden>
          <Image
            src="/images/brand/logo-backgroun.webp"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: 'contain', objectPosition: 'bottom', opacity: 0.15 }}
          />
        </div>
        <div style={layoutStyle}>
            <div style={leftStyle}>
            <div style={badgeOuterStyle} role="status" aria-label="Seção benefícios">
              <span style={badgeInnerStyle}>Benefícios</span>
              <span style={badgeOuterTextStyle}>Por que escolher a Wefronti</span>
            </div>
            <h2 id="benefits-heading" style={leftTitleStyle}>
              Vantagens em fazer seu site conosco
            </h2>
            <p style={leftDescStyle}>
              Combinamos estrutura profissional, atenção ao detalhe e suporte contínuo para que seu site gere resultados reais para seu negócio.
            </p>
            <div style={{ marginTop: spacing[6] }}>
              <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
              external
              label="Quero ter um site que vende"
              fullWidthOnMobile
              onLightBackground
            >
              Quero ter um site que vende
            </ButtonCta>
            </div>
            </div>
            <div style={gridStyle}>
            {CARDS.map(({ title, description, icon: Icon }) => (
              <article key={title} style={cardStyle}>
                <div style={cardIconWrapStyle} aria-hidden>
                  <Icon size={28} stroke="url(#benefits-icon-gradient)" strokeWidth={1.8} />
                </div>
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{title}</h3>
                  <p style={cardDescStyle}>{description}</p>
                </div>
              </article>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
