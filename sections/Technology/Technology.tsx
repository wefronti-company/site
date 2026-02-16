import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

/** Coloque suas ilustrações em public/images/tech/ (ex: nextjs.png, react.png, etc.) */
const TECH_ITEMS: { name: string; description: string; imagePath: string }[] = [
  { name: 'Next.js', description: 'Performance e SEO de alto nível', imagePath: '/images/tech/nextjs.png' },
  { name: 'React', description: 'Interface moderna e fluida', imagePath: '/images/tech/react.png' },
  { name: 'Cloudflare', description: 'Velocidade e segurança global', imagePath: '/images/tech/cloudflare.png' },
  { name: 'Google Analytics', description: 'Dados para decisões que vendem', imagePath: '/images/tech/google-analytics.png' },
];

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
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
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
  textAlign: 'left',
};

const introStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.65,
  color: colors.text.light,
  opacity: 0.88,
  margin: 0,
  textAlign: 'left',
  maxWidth: 720,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: spacing[6],
  paddingLeft: spacing[12],
  paddingRight: spacing[12],
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gap: spacing[6],
  paddingLeft: spacing[12],
  paddingRight: spacing[12],
};

/** Layout referência: esquerda e direita = cards altos; centro = 2 cards empilhados */
const gridLayoutWide: React.CSSProperties = {
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: 'minmax(260px, 1fr) minmax(260px, 1fr)',
  gridAutoRows: 'minmax(260px, 1fr)',
};

const cardStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.borderDark}`,
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const illustrationWrapStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 220,
  flex: 1,
  position: 'relative' as const,
  background: 'linear-gradient(135deg, rgba(53, 152, 255, 0.12) 0%, rgba(100, 80, 200, 0.1) 50%, rgba(180, 80, 160, 0.08) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const illustrationWrapTallStyle: React.CSSProperties = {
  ...illustrationWrapStyle,
  minHeight: 340,
};

const illustrationImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  position: 'absolute' as const,
  inset: 0,
};

const cardContentStyle: React.CSSProperties = {
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  right: 0,
  padding: spacing[6],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  background: 'transparent',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.8,
  margin: 0,
};

const Technology: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[6];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const gridLayout: React.CSSProperties = isMd
    ? { ...gridStyle, ...gridLayoutWide, paddingLeft: headerPaddingX, paddingRight: headerPaddingX }
    : { ...gridStyle, gridTemplateColumns: '1fr', paddingLeft: headerPaddingX, paddingRight: headerPaddingX };

  const getCardGridStyle = (index: number): React.CSSProperties => {
    if (!isMd) return {};
    if (index === 0) return { gridColumn: 1, gridRow: '1 / -1' };
    if (index === 1) return { gridColumn: 2, gridRow: 1 };
    if (index === 2) return { gridColumn: 2, gridRow: 2 };
    if (index === 3) return { gridColumn: 3, gridRow: '1 / -1' };
    return {};
  };

  const isTallCard = (index: number) => isMd && (index === 0 || index === 3);

  return (
    <section id="tecnologia" style={sectionStyle} aria-labelledby="tech-heading">
      <div style={innerStyleBase}>
        <div style={{ ...headerStyle, paddingLeft: headerPaddingX, paddingRight: headerPaddingX }}>
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
            Tecnologia
          </span>
          <h2 id="tech-heading" style={titleStyle}>
            Excelência em<br />tecnologia e criação de sites
          </h2>
          <p style={introStyle}>
            Usamos as melhores tecnologias do mercado para elevar o nível do seu projeto. 
            O resultado é um site extremamente rápido, bonito e, principalmente, preparado 
            para converter visitantes em clientes e fazer sua empresa faturar mais.
          </p>
        </div>

        <div style={gridLayout}>
          {TECH_ITEMS.map((item, index) => (
            <div key={item.name} style={{ ...cardStyle, ...getCardGridStyle(index) }}>
              <div style={isTallCard(index) ? illustrationWrapTallStyle : illustrationWrapStyle}>
                <img
                  src={item.imagePath}
                  alt=""
                  style={illustrationImageStyle}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{item.name}</h3>
                  <p style={cardDescStyle}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: spacing[12] }}>
          <ButtonCta label="Solicitar orçamento" />
        </div>
      </div>
    </section>
  );
};

export default Technology;
