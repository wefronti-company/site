import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import SEO from '../../components/SEO';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const LIVE_ACCENT = '#7ad49dAF';
const LIVE_TEXT_MUTED = '#6BB58A';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'transparent',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 400,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
};

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  opacity: 0.88,
  fontSize: '1.15rem',
  lineHeight: 1.7,
};

const detailTextStyle: React.CSSProperties = {
  margin: 0,
  color: colors.text.primary,
  opacity: 0.9,
  fontSize: '1.08rem',
  lineHeight: 1.8,
};

const liveBrowserStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: 18,
  border: `1px solid ${colors.neutral.border}`,
  background: '#F8FFFB',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateRows: '24px minmax(0, 1fr)',
};

const liveBrowserTopStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 10px',
  borderBottom: `1px solid ${colors.neutral.border}`,
  background: '#F8FFFB',
};

const liveDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#D1D5DB',
};

const liveBodyStyle: React.CSSProperties = {
  position: 'relative',
  padding: spacing[3],
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  gap: spacing[3],
  background: colors.text.primary,
};

const liveHeroBlockStyle: React.CSSProperties = {
  borderRadius: 10,
  background: '#F8FFFB',
  border: `1px solid ${LIVE_ACCENT}`,
  padding: '10px 12px',
  display: 'grid',
  gap: 6,
};

const liveSkeletonLineStyle = (width: string): React.CSSProperties => ({
  width,
  height: 6,
  borderRadius: 999,
  background: 'rgba(15, 23, 42, 0.12)',
});

const liveProductsRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[2],
};

const liveProductCardStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${LIVE_ACCENT}`,
  background: '#F8FFFB',
  padding: spacing[2],
  display: 'grid',
  gap: 6,
};

const liveThumbStyle: React.CSSProperties = {
  width: '100%',
  height: 34,
  borderRadius: 6,
  background: LIVE_ACCENT,
};

const livePriceStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: LIVE_TEXT_MUTED,
  lineHeight: 1,
};

const liveCtaStyle: React.CSSProperties = {
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: 'rgba(122,212,157,0.2)',
  color: LIVE_TEXT_MUTED,
  fontSize: 9,
  fontWeight: 600,
  padding: '3px 8px',
  justifySelf: 'start',
};

const livePedidoBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  right: spacing[3],
  bottom: spacing[3],
  borderRadius: 999,
  border: `1px solid ${LIVE_ACCENT}`,
  background: '#F8FFFB',
  color: LIVE_TEXT_MUTED,
  fontSize: 10,
  fontWeight: 600,
  padding: '4px 10px',
};

const DesenvolvimentoWebPage: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];

  return (
    <>
      <SEO
        title="Desenvolvimento Web"
        description="Solução de desenvolvimento web da Wefronti: sites e lojas com foco em performance, conversão e crescimento."
        canonical="/solucoes/desenvolvimento-web"
      />
      <main style={pageStyle}>
        <div
          style={{
            width: '100%',
            maxWidth: containerMaxWidth.wide,
            margin: '0 auto',
            paddingLeft: paddingX,
            paddingRight: paddingX,
            display: 'grid',
            gap: spacing[12],
          }}
        >
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: isMd ? '1.05fr 0.95fr' : '1fr',
              alignItems: 'center',
              gap: spacing[8],
            }}
          >
            <div style={{ display: 'grid', gap: spacing[5] }}>
              <h1 style={titleStyle}>Desenvolvimento Web</h1>
              <p style={subtitleStyle}>
                Criamos sites institucionais e lojas virtuais focados em resultado: performance alta,
                experiência premium e estrutura pensada para transformar visitas em vendas.
              </p>
              <div>
                <ButtonCta
                  onClick={() => {
                    if (typeof window !== 'undefined') window.location.href = '/#precos';
                  }}
                >
                  Quero meu projeto web
                </ButtonCta>
              </div>
            </div>

            <motion.div
              style={liveBrowserStyle}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={liveBrowserTopStyle}>
                <span style={liveDotStyle} />
                <span style={liveDotStyle} />
                <span style={liveDotStyle} />
              </div>
              <div style={liveBodyStyle}>
                <div style={liveHeroBlockStyle}>
                  <div style={liveSkeletonLineStyle('72%')} />
                  <div style={liveSkeletonLineStyle('48%')} />
                  <motion.div
                    style={liveCtaStyle}
                    animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Comprar
                  </motion.div>
                </div>
                <div style={liveProductsRowStyle}>
                  <div style={liveProductCardStyle}>
                    <div style={liveThumbStyle} />
                    <div style={liveSkeletonLineStyle('78%')} />
                    <motion.span
                      style={livePriceStyle}
                      animate={{ opacity: [0.65, 1, 0.65], y: [0, -1, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      R$ 149
                    </motion.span>
                  </div>
                  <div style={liveProductCardStyle}>
                    <div style={liveThumbStyle} />
                    <div style={liveSkeletonLineStyle('64%')} />
                    <motion.span
                      style={livePriceStyle}
                      animate={{ opacity: [0.65, 1, 0.65], y: [0, -1, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    >
                      R$ 239
                    </motion.span>
                  </div>
                </div>
                <motion.div
                  style={livePedidoBadgeStyle}
                  animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -4], scale: [0.96, 1, 1, 0.98] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  +1 pedido
                </motion.div>
              </div>
            </motion.div>
          </section>

          <section style={{ display: 'grid', gap: spacing[5] }}>
            <p style={detailTextStyle}>
              A solução de Desenvolvimento Web da Wefronti é construída para empresas que querem mais do que
              um site bonito: querem uma estrutura digital que gere autoridade, atraia público qualificado e
              converta esse tráfego em oportunidades reais de negócio.
            </p>
            <p style={detailTextStyle}>
              Começamos pelo entendimento da sua operação, posicionamento e objetivo comercial. A partir
              disso, desenhamos a arquitetura da informação, organizamos a jornada do usuário e definimos
              uma comunicação clara em cada seção para reduzir fricção e aumentar a taxa de ação.
            </p>
            <p style={detailTextStyle}>
              No desenvolvimento, priorizamos performance, acessibilidade, responsividade e SEO técnico.
              Isso garante carregamento rápido, melhor experiência em qualquer dispositivo e base sólida
              para ranqueamento orgânico. Em paralelo, estruturamos CTAs, provas de confiança e pontos de
              conversão com foco em geração de leads e vendas.
            </p>
            <p style={detailTextStyle}>
              Para e-commerce, implementamos a lógica de vitrine, páginas de produto, fluxo de checkout e
              integrações essenciais (pagamentos, rastreio, automações), com atenção especial à clareza da
              compra e redução de abandono. Para sites institucionais, reforçamos branding, credibilidade e
              captação comercial.
            </p>
            <p style={detailTextStyle}>
              O resultado é uma presença digital robusta, pronta para escalar com consistência: tecnologia
              bem aplicada, design orientado a negócio e uma experiência que realmente ajuda sua empresa a
              vender mais.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default DesenvolvimentoWebPage;
