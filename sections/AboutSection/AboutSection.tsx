import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: 64,
  paddingBottom: 64,
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  paddingLeft: spacing[8],
  paddingRight: spacing[8],
};

const badgeOuterStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: 6,
  borderRadius: 30,
  backgroundColor: '#040404',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  alignSelf: 'flex-start',
  width: 'fit-content',
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

const titleStyleBase: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[4],
};

const subtitleStyleBase: React.CSSProperties = {
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[4],
};

const textStyleBase: React.CSSProperties = {
  lineHeight: 1.7,
  color: colors.text.secondary,
  margin: 0,
  marginBottom: spacing[4],
};

const imageWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4/5',
  borderRadius: 24,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.12)',
};

interface AboutSectionProps {
  conteudo?: Record<string, unknown>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const titulo =
    (conteudo?.titulo != null ? String(conteudo.titulo) : '') ||
    'Visão estratégica e quem está no comando';

  const sectionPaddingX = isMd ? spacing[12] : 16;
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  const layoutStyle: React.CSSProperties = {
    display: isMd ? 'grid' : 'flex',
    flexDirection: isMd ? undefined : 'column',
    gridTemplateColumns: isMd ? 'minmax(280px, 400px) 1fr' : undefined,
    gap: spacing[12],
    alignItems: 'start',
  };

  const textBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
    textAlign: 'left',
    alignItems: 'flex-start',
  };

  const titleStyle: React.CSSProperties = {
    ...titleStyleBase,
    fontSize: isMd ? theme.sectionTitleFontSize : 'clamp(1.5rem, 5vw, 2rem)',
  };

  const subtitleStyle: React.CSSProperties = {
    ...subtitleStyleBase,
    fontSize: isMd ? fontSizes.lg : fontSizes.xl,
  };

  const textStyle: React.CSSProperties = {
    ...textStyleBase,
    fontSize: isMd ? fontSizes.base : fontSizes.lg,
  };

  return (
    <section id="sobre" style={sectionStyle} aria-labelledby="about-heading">
      <div
        style={{
          ...innerStyleBase,
          paddingLeft: isMd ? spacing[8] : 0,
          paddingRight: isMd ? spacing[8] : 0,
        }}
      >
        <div style={layoutStyle}>
          {isMd && (
            <div style={imageWrapStyle}>
              <Image
                src="/images/about/witor-linhares.webp"
                alt="Witor Linhares"
                fill
                sizes="400px"
                style={{ objectFit: 'cover', filter: 'grayscale(100%)' }}
                priority={false}
              />
            </div>
          )}

          <div style={textBlockStyle}>
            <div style={badgeOuterStyle} role="status" aria-label="Seção sobre">
              <span style={badgeInnerStyle}>Sobre</span>
              <span style={badgeOuterTextStyle}>A Wefronti e quem comanda</span>
            </div>

            <h2 id="about-heading" style={titleStyle}>
              {titulo}
            </h2>

            {!isMd && (
              <div style={imageWrapStyle}>
                <Image
                  src="/images/about/witor-linhares.webp"
                  alt="Witor Linhares"
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover', filter: 'grayscale(100%)' }}
                  priority={false}
                />
              </div>
            )}

            <p style={textStyle}>
              A Wefronti nasceu da vontade de criar sites que realmente convertem — não apenas páginas bonitas,
              mas estruturas pensadas para gerar resultados. Cada projeto é tratado com foco em clareza de
              mensagem, velocidade e uma experiência que conduz o visitante naturalmente à ação.
            </p>

            <p style={subtitleStyle}>Witor Linhares</p>

            <p style={textStyle}>
              À frente da Wefronti, combino visão estratégica com execução técnica. Acredito que um site
              bem feito é um investimento que se paga — e o objetivo é entregar exatamente isso: sites
              profissionais que aumentam a credibilidade do seu negócio e geram mais oportunidades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
