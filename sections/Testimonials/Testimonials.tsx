import React from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const TESTIMONIALS: { description: string; name: string; state: string; country: string }[] = [
  {
    description: 'A Wefronti entregou nosso site com agilidade e profissionalismo. O resultado superou as expectativas e as visitas ao site aumentaram bastante.',
    name: 'Mariana Alves',
    state: 'São Paulo',
    country: 'Brasil',
  },
  {
    description: 'Site rápido, moderno e que realmente converte. A equipe entendeu nossa necessidade e entregou além do combinado. Recomendo muito.',
    name: 'Carlos H. Mendes',
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
    description: 'Não é só um site bonito é uma ferramenta de vendas. Nosso faturamento online melhorou e a credibilidade da marca aumentou.',
    name: 'Roberto Amâncio',
    state: 'Paraná',
    country: 'Brasil',
  },
  {
    description: 'Trabalho de excelência do início ao fim. Comunicação constante, prazos cumpridos e um site que nos representa muito bem.',
    name: 'Fernanda Frigs',
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
  paddingLeft: 0,
  paddingRight: 0,
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
  border: `1px solid ${colors.neutral.border}`,
  background: colors.neutral.accordeon,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
};

const cardDescriptionStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.primary,
  margin: 0,
  opacity: 0.92,
  flex: 1,
};

const starsRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  color: '#F59E0B',
  fontSize: 18,
  lineHeight: 1,
};

const cardNameStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const cardLocationStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.75,
  margin: 0,
};

const cardFooterStyle: React.CSSProperties = {
  marginTop: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
};

const authorMetaStyle: React.CSSProperties = {
  display: 'grid',
  gap: 2,
  minWidth: 0,
};

const avatarWrapStyle: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: '50%',
  border: `1px solid ${colors.neutral.border}`,
  overflow: 'hidden',
  flexShrink: 0,
  background: colors.neutral.borderLight,
};

const avatarImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

interface TestimonialsProps {
  conteudo?: Record<string, unknown>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const getTestimonialPhotoSrc = (name: string) => {
    const slug = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `/images/testimonials/${slug}.webp`;
  };

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Depoimentos';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Resultados reais de quem apostou em um site que vende';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Veja o que aconteceu quando elas decidiram levar o digital a sério.';
  const sectionPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  type TestimonialItem = { description: string; name: string; state: string; country: string };
  const renderCard = (item: TestimonialItem, index: number, suffix: string) => (
    <div key={`${suffix}-${item.name}-${index}`} style={cardStyle}>
      <div style={starsRowStyle} aria-label="5 estrelas">
        <span aria-hidden>★</span>
        <span aria-hidden>★</span>
        <span aria-hidden>★</span>
        <span aria-hidden>★</span>
        <span aria-hidden>★</span>
      </div>
      <p style={cardDescriptionStyle}>{`"${item.description}"`}</p>
      <div style={cardFooterStyle}>
        <div style={avatarWrapStyle} aria-hidden>
          <img
            src={getTestimonialPhotoSrc(item.name)}
            alt={`Foto de ${item.name}`}
            style={avatarImageStyle}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div style={authorMetaStyle}>
          <p style={cardNameStyle}>{item.name}</p>
          <p style={cardLocationStyle}>{item.state}, {item.country}</p>
        </div>
      </div>
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
          alignItems: 'center',
        }}>
          <span style={badgeStyle} aria-hidden>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: colors.icons.secondary,
              }}
            />
            {badge}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[4], width: '100%' }}>
            <h2 id="testimonials-heading" style={titleStyle}>
              {titulo}
            </h2>
            <p style={{ ...subtitleStyle, whiteSpace: isMd ? 'nowrap' : 'normal' }}>
              {subtitulo}
            </p>
          </div>
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
