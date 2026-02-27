import React from 'react';
import { CheckCircle, CheckCircle2, CheckCircleIcon } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const LANDING_PAGE_MESSAGE = 'Olá! Quero uma landing page focada em conversão.';
const SITE_COMPLETO_MESSAGE = 'Oi! Quero um site que gere clientes e apareça no Google.';

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
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.55,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
};

/** Largura dos cards de preço menor que a seção para não ficarem tão largos */
const PRICING_GRID_MAX_WIDTH = 920;

const gridWrapStyle: React.CSSProperties = {
  maxWidth: PRICING_GRID_MAX_WIDTH,
  margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[8],
  alignItems: 'stretch',
};

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 30,
  border: `1px solid ${colors.neutral.border}`,
  padding: spacing[16],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
  background: colors.neutral.accordeon,
};

const cardEmphasisStyle: React.CSSProperties = {
  borderColor: colors.blue.primary,
  boxShadow: `0 0 24px ${colors.blue.primary}30`,
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const priceBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const priceFromLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.9,
  margin: 0,
  marginBottom: spacing[1],
};

const priceRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: spacing[2],
  flexWrap: 'wrap' as const,
};

const priceSymbolStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
};

const priceValueStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
  fontWeight: 700,
  color: colors.text.primary,
  margin: 0,
  lineHeight: 1.2,
};

const priceSecondaryStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.85,
  margin: 0,
  marginTop: spacing[2],
};

const pricePixStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.primary,
  opacity: 0.75,
  margin: 0,
  marginTop: spacing[1],
};

const featureListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
  flex: 1,
};

const featureItemStyle = (dimmed?: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: dimmed ? 0.45 : 1,
  fontStyle: dimmed ? ('italic' as const) : 'normal',
  transition: 'transform 0.2s ease',
});

const checkIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
};

const checkIconDimmedStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.neutral.gray,
};

const LANDING_FEATURES = [
  { text: '1 página única', dimmed: false },
  { text: 'Design moderno e responsivo', dimmed: false },
  { text: 'Copy focada em conversão', dimmed: false },
  { text: 'Otimizada para rodar anúncios', dimmed: false },
  { text: 'Formulário integrado', dimmed: false },
  { text: 'SEO básico', dimmed: false },
  { text: 'Performance (carregamento rápido)', dimmed: false },
  { text: 'Entrega ágil', dimmed: false },
];

const SITE_FEATURES = [
  'Múltiplas páginas estratégicas',
  'Focado em conversão e engajamento',
  'Acessível em todo os dispositivos',
  'SEO avançado',
  'Google Analytics + Google Tag Manager',
  'Integração com WhatsApp',
  'Relatório mensal de performance',
  'Suporte pós-entrega estendido',
];

interface PricingProps {
  conteudo?: Record<string, unknown>;
}

const Pricing: React.FC<PricingProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Preços';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Escolha como vamos transformar seu site em uma máquina de vendas';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Escolha o que faz mais sentido para o seu momento e deixe o resto com a gente.';
  const landingTitulo = (conteudo?.landingTitulo != null ? String(conteudo.landingTitulo) : '') || 'Landing Page';
  const landingDescricao = (conteudo?.landingDescricao != null ? String(conteudo.landingDescricao) : '') || 'A solução ideal para empresas que precisam de uma página de alta conversão para campanhas, lançamentos ou captação de leads. Rápida, objetiva e focada em um único resultado.';
  const landingPreco = (conteudo?.landingPreco != null ? String(conteudo.landingPreco) : '') || '1.397,00';
  const landingBotao = (conteudo?.landingBotao != null ? String(conteudo.landingBotao) : '') || 'Quero uma landing page';
  const siteTitulo = (conteudo?.siteTitulo != null ? String(conteudo.siteTitulo) : '') || 'Site completo';
  const siteDescricao = (conteudo?.siteDescricao != null ? String(conteudo.siteDescricao) : '') || 'Para empresas que querem construir uma presença digital sólida, aparecer no Google e ter um site que gera clientes de forma contínua não só em campanhas.';
  const sitePreco = (conteudo?.sitePreco != null ? String(conteudo.sitePreco) : '') || '3.497,00';
  const siteBotao = (conteudo?.siteBotao != null ? String(conteudo.siteBotao) : '') || 'Quero um site';

  const openWhatsApp = (contextMessage: string) => {
    if (typeof window === 'undefined') return;
    const url = buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, contextMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  const grid = isMd
    ? gridStyle
    : { ...gridStyle, gridTemplateColumns: '1fr', gap: spacing[6] };

  /** Em telas menores, menos padding nos cards para não ficar tão alto */
  const cardStyleResponsive: React.CSSProperties = {
    ...cardBaseStyle,
    padding: isMd ? spacing[16] : spacing[6],
  };

  return (
    <section id="precos" style={sectionStyle} aria-labelledby="pricing-heading">
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMd ? 'center' : 'flex-start', gap: spacing[4], width: '100%', maxWidth: 880 }}>
            <h2 id="pricing-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
              {titulo}
            </h2>
            <p style={{ ...subtitleStyle, textAlign: isMd ? 'center' : 'left' }}>
              {subtitulo}
            </p>
          </div>
        </div>

        <div style={gridWrapStyle}>
          <div style={grid}>
          <div style={cardStyleResponsive}>
            <h3 style={cardTitleStyle}>{landingTitulo}</h3>
            <p style={{ fontSize: fontSizes.sm, color: colors.text.primary, opacity: 0.88, margin: 0 }}>
              {landingDescricao}
            </p>
            <div style={priceBlockStyle}>
              <p style={priceFromLabelStyle}>A partir de:</p>
              <div style={priceRowStyle}>
                <span style={priceSymbolStyle}>R$</span>
                <span style={priceValueStyle}>{landingPreco}</span>
              </div>
              <p style={priceSecondaryStyle}>Parcelado em até 10x </p>
              <p style={pricePixStyle}>À vista no PIX: 10% de desconto</p>
            </div>
            <ul style={featureListStyle}>
              {LANDING_FEATURES.map((item, i) => (
                <li key={i} className="pricing-feature-item" style={featureItemStyle(item.dimmed)}>
                  <span style={item.dimmed ? checkIconDimmedStyle : checkIconStyle} aria-hidden>
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <ButtonCta
                label={landingBotao}
                onClick={() => {
                  openWhatsApp(LANDING_PAGE_MESSAGE);
                }}
              />
            </div>
          </div>

          <div style={{ ...cardStyleResponsive, ...cardEmphasisStyle }}>
            <h3 style={cardTitleStyle}>{siteTitulo}</h3>
            <p style={{ fontSize: fontSizes.sm, color: colors.text.primary, opacity: 0.88, margin: 0 }}>
              {siteDescricao}
            </p>
            <div style={priceBlockStyle}>
              <p style={priceFromLabelStyle}>A partir de:</p>
              <div style={priceRowStyle}>
                <span style={priceSymbolStyle}>R$</span>
                <span style={priceValueStyle}>{sitePreco}</span>
              </div>
              <p style={priceSecondaryStyle}>Parcelado em até 10x</p>
              <p style={pricePixStyle}>À vista no PIX: 10% de desconto</p>
            </div>
            <ul style={featureListStyle}>
              {SITE_FEATURES.map((text, i) => (
                <li key={i} className="pricing-feature-item" style={featureItemStyle(false)}>
                  <span style={checkIconStyle} aria-hidden>
                    <CheckCircle2 size={20} strokeWidth={2} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 'auto' }}>
              <ButtonCta
                label={siteBotao}
                onClick={() => {
                  openWhatsApp(SITE_COMPLETO_MESSAGE);
                }}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
