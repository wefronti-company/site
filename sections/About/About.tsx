import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Check } from 'lucide-react';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: colors.background.dark,
};

const innerStyleBase: React.CSSProperties = {
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'grid',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  alignSelf: 'flex-start',
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.borderDark}`,
  backgroundColor: 'rgba(255,255,255,0.04)',
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.text.light,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.light,
  margin: 0,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  lineHeight: 1.6,
  color: colors.text.light,
  opacity: 0.88,
  margin: 0,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  marginTop: spacing[6],
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  fontSize: fontSizes.base,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.92,
};

const checkIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 22,
  height: 22,
  borderRadius: '50%',
  background: 'rgba(53, 152, 255, 0.2)',
  color: colors.blue.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const imageWrapStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '3 / 4',
  maxHeight: 520,
  borderRadius: 24,
  overflow: 'hidden',
  border: `1px solid ${colors.neutral.borderDark}`,
  boxShadow: `0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(53, 152, 255, 0.08)`,
  position: 'relative' as const,
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  display: 'block',
};

const directorOverlayStyle: React.CSSProperties = {
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  padding: spacing[6],
  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: spacing[2],
  maxWidth: '85%',
};

const directorTitleStyle: React.CSSProperties = {
  fontSize: '1.4rem',
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
};

const directorSubtitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  margin: 0,
  fontSize: '1.05rem',
  color: colors.text.light,
  opacity: 0.92,
};

const directorIconStyle: React.CSSProperties = {
  flexShrink: 0,
  width: 20,
  height: 20,
  objectFit: 'contain' as const,
  opacity: 0.92,
};

const ABOUT_ITEMS: string[] = [
  'Sites otimizados para conversão e para o Google',
  'Parceria e suporte pós-entrega — não somimos depois da entrega',
];

const About: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  /** Em telas maiores, mesmo recuo horizontal da seção Projetos (padding do grid) */
  const gridStyle: React.CSSProperties = {
    ...innerStyleBase,
    gridTemplateColumns: isMd ? '0.9fr 1.1fr' : '1fr',
    alignItems: 'center',
    gap: isMd ? spacing[12] : spacing[8],
    paddingLeft: isMd ? headerPaddingX : 0,
    paddingRight: isMd ? headerPaddingX : 0,
  };

  const imageColumnStyle: React.CSSProperties = {
    minWidth: 0,
    order: isMd ? 0 : 1,
  };

  const textColumnStyle: React.CSSProperties = {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[6],
    paddingLeft: 0,
    paddingRight: 0,
    order: isMd ? 0 : 0,
  };

  return (
    <section id="sobre" style={sectionStyle} aria-labelledby="about-heading">
      <div style={gridStyle}>
        <div style={imageColumnStyle}>
          <div style={imageWrapStyle}>
            <Image
              src="/images/about/witor-linhares.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 480px"
              style={imageStyle}
            />
            <div style={directorOverlayStyle}>
              <p style={directorTitleStyle}>Diretor Wefronti</p>
              <div style={directorSubtitleStyle} aria-label="@witorlinhares no Instagram e LinkedIn">
                <Image src="/images/icons/instagram.webp" alt="" width={20} height={20} style={directorIconStyle} aria-hidden />
                <Image src="/images/icons/linkedin.webp" alt="" width={20} height={20} style={directorIconStyle} aria-hidden />
                <span>@witorlinhares</span>
              </div>
            </div>
          </div>
        </div>

        <div style={textColumnStyle}>
          <span style={badgeStyle} aria-hidden>
            <span
              className="badge-dot-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors.blue.primary,
              }}
            />
            Sobre
          </span>
          <h2 id="about-heading" style={titleStyle}>
          Nascemos para provar que site bom é site que vende
          </h2>
          <p style={descriptionStyle}>
          A Wefronti surgiu da frustração de ver empresas sérias presas a sites lentos, feios e invisíveis no Google enquanto pagavam caro por isso. Decidimos fazer diferente: unir design de alto nível, tecnologia de ponta e estratégia de conversão em um único lugar. Transparência, prazos reais e suporte de verdade porque o seu sucesso é a única métrica que nos importa.

          </p>

        </div>
      </div>
    </section>
  );
};

export default About;
