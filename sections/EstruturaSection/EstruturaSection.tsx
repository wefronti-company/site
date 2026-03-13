import React from 'react';
import { Magnet, MessagesSquare, Star, CircleDollarSign } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const CARDS = [
  {
    title: 'Atrair novos clientes',
    description: 'Estrutura de SEO e conteúdo pensada para aparecer nos buscadores e redes, levando visitantes qualificados até você.',
    icon: Magnet,
  },
  {
    title: 'Quebrar objeções',
    description: 'Página que antecipa dúvidas e medos do visitante, apresentando provas e argumentos que facilitam a decisão.',
    icon: MessagesSquare,
  },
  {
    title: 'Percepção de valor',
    description: 'Design e copy que destacam o que sua oferta entrega, gerando desejo e justificando o investimento.',
    icon: Star,
  },
  {
    title: 'Estratégia para converter',
    description: 'Chamadas à ação claras, formulários otimizados e fluxo que conduz o visitante até a conversão.',
    icon: CircleDollarSign,
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

const innerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  marginBottom: spacing[12],
};

const titleStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  borderRadius: 30,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: '#040404',
  backdropFilter: 'saturate(150%) blur(20px)',
  WebkitBackdropFilter: 'saturate(150%) blur(20px)',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
  paddingTop: 0,
  paddingBottom: spacing[6],
  paddingLeft: spacing[6],
  paddingRight: spacing[6],
};

const cardBarStyle: React.CSSProperties = {
  width: '40%',
  minWidth: 60,
  maxWidth: 100,
  height: 3,
  borderRadius: '0 0 2px 2px',
  marginBottom: spacing[4],
  flexShrink: 0,
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
  boxShadow: '0 0 12px rgba(73, 192, 255, 0.6), 0 0 24px rgba(2, 128, 255, 0.35)',
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
  gap: spacing[3],
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

const EstruturaSection: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMd ? 'repeat(4, 1fr)' : '1fr',
    gap: spacing[8],
  };

  return (
    <section id="estrutura" style={sectionStyle} aria-labelledby="estrutura-heading">
      <svg width={0} height={0} aria-hidden style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="estrutura-icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#49C0FF" />
            <stop offset="100%" stopColor="#0280FF" />
          </linearGradient>
        </defs>
      </svg>
      <div style={innerStyle}>
        <header style={headerStyle}>
          <h2 id="estrutura-heading" style={titleStyle}>
            Uma estrutura pronta para gerar clientes
          </h2>
        </header>
        <div style={gridStyle}>
          {CARDS.map(({ title, description, icon: Icon }) => (
            <article key={title} style={cardStyle}>
              <div style={cardBarStyle} aria-hidden />
              <div style={cardIconWrapStyle} aria-hidden>
                <Icon size={28} stroke="url(#estrutura-icon-gradient)" strokeWidth={1.8} />
              </div>
              <div style={cardContentStyle}>
                <h3 style={cardTitleStyle}>{title}</h3>
                <p style={cardDescStyle}>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EstruturaSection;
