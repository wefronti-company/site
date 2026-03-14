import React from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO } from '../../lib/whatsapp';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

type TestimonialItem = {
  name: string;
  city: string;
  state: string;
  quote: string;
  photoSrc: string;
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    name: 'Alberto Macedo',
    city: 'São Paulo',
    state: 'SP',
    quote: 'Site entregue no prazo, comunicação clara em cada etapa. Aumentou nossa credibilidade na hora.',
    photoSrc: '/images/testimonials/cl-01.png',
  },
  {
    name: 'Ricardo Mendes',
    city: 'Belo Horizonte',
    state: 'MG',
    quote: 'Profissionalismo do início ao fim. Nosso site passou a gerar bem mais contatos desde o lançamento.',
    photoSrc: '/images/testimonials/cl-02.png',
  },
  {
    name: 'Rogério Santana',
    city: 'Curitiba',
    state: 'PR',
    quote: 'Precisávamos de algo rápido e bem feito. Entregaram tudo que prometeram, sem enrolação.',
    photoSrc: '/images/testimonials/cl-03.png',
  },
  {
    name: 'Fernanda Alvarenga',
    city: 'Porto Alegre',
    state: 'RS',
    quote: 'O investimento se pagou em poucos meses. Site rápido e que realmente converte visitante em cliente.',
    photoSrc: '/images/testimonials/cl-04.png',
  },
  {
    name: 'Juliana Ribeiro',
    city: 'Florianópolis',
    state: 'SC',
    quote: 'Atendimento excelente e resultado que superou expectativas. Meu site ficou muito mais profissional.',
    photoSrc: '/images/testimonials/cl-05.png',
  },
  {
    name: 'Pedro Henrique',
    city: 'Brasília',
    state: 'DF',
    quote: 'Site profissional, carregamento rápido. Recomendo para quem quer um resultado de verdade.',
    photoSrc: '/images/testimonials/cl-06.png',
  },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[24],
  paddingBottom: spacing[24],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[12],
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

const titleStyle: React.CSSProperties = {
  fontSize: theme.sectionTitleFontSize,
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  padding: spacing[6],
  borderRadius: 30,
  backgroundColor: 'rgba(26, 26, 28, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  textAlign: 'left',
  position: 'relative' as const,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
};

/** Barra vertical em gradiente à esquerda do card */
const accentBarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 3,
  height: '50%',
  borderRadius: 2,
  background: 'linear-gradient(180deg, #49C0FF, #0280FF)',
  boxShadow: '0 0 10px rgba(131, 216, 242, 0.7), 0 0 20px rgba(110, 210, 253, 0.5)',
};

/** Efeito de luz gradiente da esquerda para direita: azul claro → transparência */
const cardSpotlightStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to right, rgba(180, 220, 255, 0.08) 0%, rgba(131, 199, 255, 0) 40%, rgba(73, 191, 255, 0) 70%, transparent 100%)',
  pointerEvents: 'none',
  zIndex: 0,
};

const cardContentWrapStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const quoteStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  lineHeight: 1.6,
  color: colors.text.primary,
  opacity: 0.92,
  margin: 0,
  paddingLeft: spacing[2],
};

const authorRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[4],
  paddingLeft: spacing[2],
};

const photoWrapStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  border: '2px solid rgba(255, 255, 255, 0.14)',
};

const authorInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const authorNameStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const authorLocationStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.secondary,
  margin: 0,
};

const ctaWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[6],
  textAlign: 'center',
  marginTop: spacing[8],
};

const ctaTextStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  lineHeight: 1.5,
  color: colors.text.primary,
  opacity: 0.9,
  margin: 0,
  maxWidth: 480,
};

interface TestimonialsProps {
  conteudo?: Record<string, unknown>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'O que quem fez site com a gente diz';
  const items = Array.isArray(conteudo?.testimonials)
    ? (conteudo.testimonials as TestimonialItem[])
    : TESTIMONIALS;

  const sectionPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: sectionPaddingX,
    paddingRight: sectionPaddingX,
  };

  return (
    <section id="depoimentos" style={sectionStyle} aria-labelledby="testimonials-heading">
      <div
        style={{
          ...innerStyleBase,
          paddingLeft: isMd ? spacing[8] : 0,
          paddingRight: isMd ? spacing[8] : 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
          <div style={badgeOuterStyle} role="status" aria-label="Seção depoimentos">
            <span style={badgeInnerStyle}>Depoimentos</span>
            <span style={badgeOuterTextStyle}>Clientes que fizeram site com a Wefronti</span>
          </div>
          <h2 id="testimonials-heading" style={titleStyle}>
            {titulo}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMd ? 'repeat(3, 1fr)' : '1fr',
            gap: spacing[6],
          }}
        >
          {items.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              style={cardStyle}
              aria-labelledby={`testimonial-author-${index}`}
            >
              <div style={cardSpotlightStyle} aria-hidden />
              <div style={accentBarStyle} aria-hidden />
              <div style={cardContentWrapStyle}>
                <p style={quoteStyle}>{item.quote}</p>
                <div style={authorRowStyle}>
                  <div style={photoWrapStyle}>
                    <Image
                      src={item.photoSrc}
                      alt=""
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', width: '100%', height: '100%', filter: 'grayscale(100%)' }}
                      loading="lazy"
                    />
                  </div>
                <div style={authorInfoStyle}>
                  <p id={`testimonial-author-${index}`} style={authorNameStyle}>
                    {item.name}
                  </p>
                  <p style={authorLocationStyle}>
                    {item.city}, {item.state}
                  </p>
                </div>
              </div>
              </div>
            </article>
          ))}
        </div>

        <div
          style={{
            ...ctaWrapStyle,
            alignItems: isMd ? 'flex-end' : 'flex-start',
            alignSelf: isMd ? 'flex-end' : undefined,
            textAlign: isMd ? 'right' : 'left',
            maxWidth: isMd ? 380 : undefined,
          }}
        >
          <p style={ctaTextStyle}>
            Quer fazer parte desse grupo? Fale conosco e peça um orçamento sem compromisso.
          </p>
          <div style={{ alignSelf: isMd ? 'flex-end' : 'stretch', width: isMd ? undefined : '100%' }}>
            <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_ORCAMENTO)}
              external
              label="Quero um site que vende"
              fullWidthOnMobile={!isMd}
            >
              Quero um site que vende
            </ButtonCta>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
