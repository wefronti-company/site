import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const CARDS = [
  {
    title: 'Percepção de valor',
    description: 'Design e copy que destacam o que sua oferta entrega, gerando desejo e justificando o investimento.',
    image: '/images/bento/percepcao-de-valor.webp',
    imageAlt: 'Percepção de valor',
    gridArea: { md: '1 / 1 / 2 / 4' },
    imageAspectRatio: '24/13',
  },
  {
    title: 'Estrutura de conversão',
    description: 'Chamadas à ação claras, formulários otimizados e fluxo que conduz o visitante até a conversão.',
    image: '/images/bento/estrutura-de-conversão.webp',
    imageAlt: 'Estrutura de conversão',
    gridArea: { md: '1 / 4 / 2 / 7' },
    imageAspectRatio: '24/13',
  },
  {
    title: 'Faturamento maior com o site certo',
    description: 'Um site profissional atrai mais clientes qualificados e aumenta suas conversões.',
    image: '/images/bento/faturamento.webp',
    imageAlt: 'Faturamento',
    gridArea: { md: '2 / 1 / 3 / 3' },
    imageAspectRatio: '16/12' as const,
  },
  {
    title: 'Atrair novos clientes',
    description: 'Estrutura de SEO e conteúdo pensada para aparecer nos buscadores e redes, levando visitantes qualificados até você.',
    image: '/images/bento/atracao.webp',
    imageAlt: 'Atração',
    gridArea: { md: '2 / 3 / 3 / 5' },
    imageAspectRatio: '16/12' as const,
  },
  {
    title: 'O site certo destaca seu negócio',
    description: 'Um site profissional diferencia você da concorrência e transmite credibilidade.',
    image: '/images/bento/destaque.webp',
    imageAlt: 'Destaque',
    gridArea: { md: '2 / 5 / 3 / 7' },
    imageAspectRatio: '16/12' as const,
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

const innerStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  marginBottom: spacing[12],
};

const badgeOuterStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: 6,
  borderRadius: 30,
  backgroundColor: '#040404',
  border: '1px solid rgba(255, 255, 255, 0.12)',
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
  color: colors.text.secondary,
  margin: 0,
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

const getCardBaseStyle = (aspectRatio: string): React.CSSProperties => ({
  position: 'relative',
  borderRadius: 30,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  overflow: 'hidden',
  aspectRatio,
});

const cardImageWrapStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
};

const cardImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const cardContentStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  padding: spacing[6],
};

const cardTitleRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
};

const cardNumberStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: 'linear-gradient(90deg, #49C0FF, #0280FF)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: '#fff',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.55,
  color: colors.text.secondary,
  margin: 0,
  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
};

const ctaWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[8],
  marginTop: spacing[12],
};

const ctaTextWrapStyle: React.CSSProperties = {
  flex: '1 1 80%',
  minWidth: 0,
};

const ctaTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  lineHeight: 1.3,
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[2],
};

const ctaDescStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.5,
  color: colors.text.secondary,
  margin: 0,
};

const ctaButtonWrapStyle: React.CSSProperties = {
  flex: '0 0 auto',
  display: 'flex',
  justifyContent: 'flex-end',
  marginLeft: 'auto',
};

const BentoSection: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const innerStyle: React.CSSProperties = {
    ...innerStyleBase,
    paddingLeft: isMd ? spacing[8] : 16,
    paddingRight: isMd ? spacing[8] : 16,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing[6],
    gridTemplateColumns: isMd ? 'repeat(6, 1fr)' : '1fr',
    gridAutoRows: isMd ? 'minmax(200px, auto)' : 'auto',
  };

  return (
    <section id="site-importante" style={sectionStyle} aria-labelledby="bento-heading">
      <div style={innerStyle}>
        <header style={headerStyle}>
          <div style={badgeOuterStyle} role="status" aria-label="Seção importância do site">
            <span style={badgeInnerStyle}>Por quê</span>
            <span style={badgeOuterTextStyle}>O site certo importa</span>
          </div>
          <h2 id="bento-heading" style={titleStyle}>
            Por que o site certo é importante para seu negócio
          </h2>
        </header>
        <div style={gridStyle}>
          {CARDS.map(({ title, description, image, imageAlt, gridArea, imageAspectRatio }, index) => (
            <article
              key={title}
              style={{
                ...getCardBaseStyle(imageAspectRatio ?? '16/12'),
                ...(isMd ? { gridArea: gridArea.md } : {}),
              }}
            >
              <div style={cardImageWrapStyle}>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes={isMd ? '(max-width: 768px) 100vw, 33vw' : '100vw'}
                  style={cardImageStyle}
                />
              </div>
              <div style={cardContentStyle}>
                <div style={cardTitleRowStyle}>
                  <span style={cardNumberStyle} aria-hidden>{index + 1}</span>
                  <h3 style={cardTitleStyle}>{title}</h3>
                </div>
                <p style={cardDescStyle}>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <div style={{ ...ctaWrapStyle, ...(isMd ? {} : { flexDirection: 'column', alignItems: 'stretch', textAlign: 'center' }) }}>
          <div style={{ ...ctaTextWrapStyle, ...(isMd ? {} : { flex: '1 1 auto', marginBottom: spacing[4] }) }}>
            <h3 style={ctaTitleStyle}>Seu negócio pronto para converter</h3>
            <p style={ctaDescStyle}>
              Um site profissional que atrai visitantes qualificados, gera confiança e transforma cliques em clientes. Vamos criar isso juntos?
            </p>
          </div>
          <div style={{ ...ctaButtonWrapStyle, ...(isMd ? {} : { flex: '1 1 auto', justifyContent: 'center' }) }}>
            <ButtonCta label="Quero ter um site que vende" fullWidthOnMobile />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoSection;
