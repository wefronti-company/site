import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const TESTIMONIALS: { description: string; name: string; state: string; country: string }[] = [
  {
    description: 'A Wefronti entregou nosso site com agilidade e profissionalismo. O resultado superou as expectativas e as visitas ao site aumentaram bastante.',
    name: 'Maria Silva',
    state: 'São Paulo',
    country: 'Brasil',
  },
  {
    description: 'Site rápido, moderno e que realmente converte. A equipe entendeu nossa necessidade e entregou além do combinado. Recomendo muito.',
    name: 'Carlos Mendes',
    state: 'Minas Gerais',
    country: 'Brasil',
  },
  {
    description: 'Depois que lançamos o site feito pela Wefronti, o número de leads qualificados cresceu. Processos claros e suporte sempre disponível.',
    name: 'Ana Paula Costa',
    state: 'Rio de Janeiro',
    country: 'Brasil',
  },
  {
    description: 'Não é só um site bonito — é uma ferramenta de vendas. Nosso faturamento online melhorou e a credibilidade da marca aumentou.',
    name: 'Roberto Oliveira',
    state: 'Paraná',
    country: 'Brasil',
  },
  {
    description: 'Trabalho de excelência do início ao fim. Comunicação constante, prazos cumpridos e um site que nos representa muito bem.',
    name: 'Fernanda Lima',
    state: 'Santa Catarina',
    country: 'Brasil',
  },
];

/** Segundo conjunto de depoimentos — carrossel inferior (esquerda → direita) */
const TESTIMONIALS_2: { description: string; name: string; state: string; country: string }[] = [
  {
    description: 'Profissionalismo e atenção aos detalhes em cada etapa. O site reflete exatamente o que nossa empresa precisava para crescer no digital.',
    name: 'Paulo Henrique Souza',
    state: 'Bahia',
    country: 'Brasil',
  },
  {
    description: 'A Wefronti transformou nossa presença online. Agora temos um site que gera resultados e transmite confiança para os clientes.',
    name: 'Juliana Martins',
    state: 'Pernambuco',
    country: 'Brasil',
  },
  {
    description: 'Rápido, transparente e muito competente. O suporte pós-entrega faz toda a diferença. Recomendo de olhos fechados.',
    name: 'Ricardo Ferreira',
    state: 'Goiás',
    country: 'Brasil',
  },
  {
    description: 'Finalmente um site que não é só vitrine: traz retorno. A equipe entende de negócio e entrega soluções que funcionam.',
    name: 'Camila Rocha',
    state: 'Espírito Santo',
    country: 'Brasil',
  },
  {
    description: 'Do briefing à entrega, tudo impecável. Nosso site está rápido, bonito e já trouxe vários contatos qualificados.',
    name: 'André Luiz Santos',
    state: 'Distrito Federal',
    country: 'Brasil',
  },
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
  textAlign: 'center',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  paddingLeft: spacing[12],
  paddingRight: spacing[12],
};

/** Largura total da viewport para sensação de infinito */
const carouselWrapStyle: React.CSSProperties = {
  width: '100vw',
  position: 'relative' as const,
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  overflow: 'hidden',
};

const carouselWrapWithRespiroStyle: React.CSSProperties = {
  ...carouselWrapStyle,
  marginTop: spacing[12],
};

const carouselWrapSecondStyle: React.CSSProperties = {
  ...carouselWrapStyle,
  marginTop: spacing[8],
};

const CARD_WIDTH = 380;
const CARD_GAP = spacing[6];
/** Largura de um grupo (5 cards + 4 gaps entre eles) */
const SET_WIDTH = 5 * CARD_WIDTH + 4 * CARD_GAP;
/** Offset em px para loop perfeito: um grupo + o gap entre os dois grupos */
const SCROLL_OFFSET_PX = SET_WIDTH + CARD_GAP;

const carouselTrackStyle: React.CSSProperties = {
  display: 'flex',
  width: SET_WIDTH * 2 + CARD_GAP,
  flexShrink: 0,
  gap: CARD_GAP,
  willChange: 'transform',
};

const carouselGroupStyle: React.CSSProperties = {
  display: 'flex',
  width: SET_WIDTH,
  flexShrink: 0,
  gap: CARD_GAP,
};

const cardStyle: React.CSSProperties = {
  width: CARD_WIDTH,
  flexShrink: 0,
  padding: spacing[8],
  borderRadius: 30,
  border: `1px solid ${colors.neutral.borderDark}`,
  background: colors.neutral.accordeon,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const cardDescriptionStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.light,
  margin: 0,
  opacity: 0.92,
};

const cardNameStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const cardLocationStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.75,
  margin: 0,
};

const Testimonials: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };

  type TestimonialItem = { description: string; name: string; state: string; country: string };
  const renderCard = (item: TestimonialItem, index: number, suffix: string) => (
    <div key={`${suffix}-${item.name}-${index}`} style={cardStyle}>
      <p style={cardDescriptionStyle}>{item.description}</p>
      <p style={cardNameStyle}>{item.name}</p>
      <p style={cardLocationStyle}>{item.state}, {item.country}</p>
    </div>
  );

  const trackAnimationStyle: React.CSSProperties = {
    animation: `testimonials-scroll-px 80s linear infinite`,
    backfaceVisibility: 'hidden',
  };
  const trackReverseAnimationStyle: React.CSSProperties = {
    animation: `testimonials-scroll-reverse-px 80s linear infinite`,
    backfaceVisibility: 'hidden',
  };

  return (
    <section id="depoimentos" style={sectionStyle} aria-labelledby="testimonials-heading">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes testimonials-scroll-px {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-${SCROLL_OFFSET_PX}px, 0, 0); }
}
@keyframes testimonials-scroll-reverse-px {
  0% { transform: translate3d(-${SCROLL_OFFSET_PX}px, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .testimonials-track-px, .testimonials-track-reverse-px { animation: none !important; }
}
          `.trim(),
        }}
      />
      <div style={innerStyleBase}>
        <div style={{
          ...headerStyle,
          paddingLeft: headerPaddingX,
          paddingRight: headerPaddingX,
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
            Depoimentos
          </span>
          <h2 id="testimonials-heading" style={{ ...titleStyle, textAlign: isMd ? 'center' : 'left' }}>
            O que nossos clientes dizem
          </h2>
        </div>
      </div>

      <div style={carouselWrapWithRespiroStyle}>
        <div
          className="testimonials-track-px"
          style={{ ...carouselTrackStyle, ...trackAnimationStyle }}
          aria-hidden="true"
        >
          <div style={carouselGroupStyle}>
            {TESTIMONIALS.map((item, index) => renderCard(item, index, 'a'))}
          </div>
          <div style={carouselGroupStyle}>
            {TESTIMONIALS.map((item, index) => renderCard(item, index + 5, 'a'))}
          </div>
        </div>
      </div>

      <div style={carouselWrapSecondStyle}>
        <div
          className="testimonials-track-reverse-px"
          style={{ ...carouselTrackStyle, ...trackReverseAnimationStyle }}
          aria-hidden="true"
        >
          <div style={carouselGroupStyle}>
            {TESTIMONIALS_2.map((item, index) => renderCard(item, index, 'b'))}
          </div>
          <div style={carouselGroupStyle}>
            {TESTIMONIALS_2.map((item, index) => renderCard(item, index + 5, 'b'))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
