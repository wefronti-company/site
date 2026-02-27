import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

/**
 * Regra para imagens em telas menores:
 * - Telas maiores: imagePath (ex: /images/tech/framer.webp)
 * - Telas menores: mesmo caminho com "-mobile" antes da extensão (ex: /images/tech/framer-mobile.webp).
 *   Coloque os arquivos em public/images/tech/ (ex: framer-mobile.webp). Se não existir, usa imagePath.
 * - Opcional: imagePathMobile no item sobrescreve esse padrão.
 */
function getMobileImagePath(desktopPath: string): string {
  const lastDot = desktopPath.lastIndexOf('.');
  if (lastDot === -1) return `${desktopPath}-mobile`;
  return `${desktopPath.slice(0, lastDot)}-mobile${desktopPath.slice(lastDot)}`;
}

const TECH_ITEMS: { name: string; description: string; imagePath: string; imagePathMobile?: string }[] = [
  { name: 'Next.js + React', description: 'A combinação de tecnologia escolhida pelas empresas que dominam o digital: sites ultrarrápidos, bem posicionados no Google e preparados para converter.', imagePath: '/images/tech/nextjs-react.webp' },
  { name: 'Framer', description: 'O design certo não enfeita, ele vende. Usamos o Framer para criar experiências visuais que transformam visitantes em clientes.', imagePath: '/images/tech/framer.webp' },
  { name: 'Cloudflare', description: 'A infraestrutura que protege seu site 24 horas por dia, porque um site fora do ar ou lento não é só um problema técnico, é dinheiro deixado na mesa.', imagePath: '/images/tech/cloudflare.webp' },
  { name: 'Google Analytics', description: 'Saiba exatamente de onde vêm seus clientes, o que eles fazem no seu site e onde você está perdendo vendas e tome decisões com dados, não com achismo.', imagePath: '/images/tech/google-analytics.webp' },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
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
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: colors.neutral.accordeon,
  fontSize: fontSizes.xs,
  fontWeight: 500,
  color: colors.text.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
  textAlign: 'left',
};

const introStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.65,
  color: colors.text.primary,
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
  gridTemplateRows: 'minmax(320px, 1fr) minmax(320px, 1fr)',
  gridAutoRows: 'minmax(320px, 1fr)',
};

const cardStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.border}`,
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const illustrationWrapStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 280,
  flex: 1,
  position: 'relative' as const,
  background: 'linear-gradient(135deg, rgba(53, 152, 255, 0.12) 0%, rgba(100, 80, 200, 0.1) 50%, rgba(180, 80, 160, 0.08) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const illustrationWrapTallStyle: React.CSSProperties = {
  ...illustrationWrapStyle,
  minHeight: 400,
};

const illustrationImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const,
  position: 'absolute' as const,
  inset: 0,
};

/** Em telas menores: cover para preencher todo o card, sem faixas nas laterais */
const illustrationImageStyleMobile: React.CSSProperties = {
  ...illustrationImageStyle,
  objectFit: 'cover' as const,
  objectPosition: 'center',
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
  fontSize: '1.3rem',
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '1rem',
  lineHeight: 1.5,
  color: colors.text.primary,
  opacity: 0.8,
  margin: 0,
};

interface TechnologyProps {
  conteudo?: Record<string, unknown>;
}

const Technology: React.FC<TechnologyProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Tecnologia';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Excelência em\ntecnologia e criação de sites';
  const intro = (conteudo?.intro != null ? String(conteudo.intro) : '') || 'Usamos as melhores tecnologias do mercado para elevar o nível do seu projeto. O resultado é um site extremamente rápido, bonito e, principalmente, preparado para converter visitantes em clientes e fazer sua empresa faturar mais.';
  const botao = (conteudo?.botao != null ? String(conteudo.botao) : '') || 'Quero um site que vende';
  const tituloLines = titulo.split('\n');
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  /** Em telas menores, sem padding horizontal no header/grid para igualar à largura da seção Preços */
  const gridLayout: React.CSSProperties = isMd
    ? { ...gridStyle, ...gridLayoutWide, paddingLeft: spacing[12], paddingRight: spacing[12] }
    : { ...gridStyle, gridTemplateColumns: '1fr', paddingLeft: 0, paddingRight: 0 };

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
        <div style={{
          ...headerStyle,
          paddingLeft: isMd ? spacing[12] : 0,
          paddingRight: isMd ? spacing[12] : 0,
          alignItems: isMd ? 'center' : 'flex-start',
        }}>
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
            {badge}
          </span>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMd ? 'center' : 'flex-start',
            gap: spacing[4],
            width: '100%',
            maxWidth: isMd ? 880 : undefined,
          }}>
            <h2 id="tech-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
              {tituloLines.map((line, i, arr) => (
                <React.Fragment key={i}>{line}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
              ))}
            </h2>
            <p style={{ ...introStyle, textAlign: isMd ? 'center' : 'left' }}>
              {intro}
            </p>
          </div>
        </div>

        <div style={gridLayout}>
          {TECH_ITEMS.map((item, index) => (
            <div key={item.name} style={{ ...cardStyle, ...getCardGridStyle(index) }}>
              <div style={isTallCard(index) ? illustrationWrapTallStyle : { ...illustrationWrapStyle, minHeight: isMd ? 280 : 340 }}>
                <Image
                  src={isMd ? item.imagePath : (item.imagePathMobile ?? getMobileImagePath(item.imagePath))}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={isMd ? illustrationImageStyle : illustrationImageStyleMobile}
                />
                <div style={cardContentStyle}>
                  <h3 style={cardTitleStyle}>{item.name}</h3>
                  <p style={cardDescStyle}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: isMd ? 'center' : 'flex-start', marginTop: spacing[12] }}>
          <ButtonCta label={botao} />
        </div>
      </div>
    </section>
  );
};

export default Technology;
