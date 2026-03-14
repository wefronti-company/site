import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_DUVIDAS } from '../../lib/whatsapp';

const { colors, spacing, fontSizes, containerMaxWidth } = theme;

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Quais formas de pagamento vocês aceitam?',
    answer:
      'Aceitamos PIX, transferência bancária e parcelamento em cartão de crédito. O pagamento pode ser dividido em etapas combinadas com as entregas, sem surpresas. Detalhamos tudo no orçamento antes de começar.',
  },
  {
    question: 'Posso parcelar o investimento?',
    answer:
      'Sim. Trabalhamos com parcelamento em até 12x no cartão ou em parcelas combinadas com as entregas do projeto (ex.: 50% na aprovação e 50% na entrega). O formato é alinhado no fechamento.',
  },
  {
    question: 'Em quanto tempo o site fica pronto?',
    answer:
      'Entre 14 e 21 dias, em média, conforme o tamanho e complexidade do site. Definimos o prazo no orçamento, sem enrolação.',
  },
  {
    question: 'O site fica no meu nome ou fico preso à Wefronti?',
    answer:
      'O site é 100% seu. Entregamos no seu domínio, com acessos e orientação. Não há mensalidade obrigatória nossa após a entrega. Suporte contínuo é opcional.',
  },
  {
    question: 'Preciso ter todo o conteúdo pronto antes de começar?',
    answer:
      'Não necessariamente. No onboarding alinhamos o que você já tem e o que falta. Podemos orientar textos, imagens e estrutura. Quanto mais informação você passar, mais alinhado o resultado ficará.',
  },
  {
    question: 'E se eu precisar de ajustes no site depois da entrega?',
    answer:
      'Incluímos suporte pós-entrega para ajustes iniciais. Depois, oferecemos planos de manutenção mensal se quiser. Não é obrigatório.',
  },
];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: colors.background.general,
};

const innerStyleBase: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  display: 'grid',
  gap: spacing[12],
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
  padding: spacing[12],
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

const descriptionStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  lineHeight: 1.6,
  color: colors.text.primary,
  opacity: 0.85,
  margin: 0,
  maxWidth: 420,
};

const rightColumnStyle: React.CSSProperties = {
  minWidth: 0,
  padding: spacing[12],
};

const accordionListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

interface FaqProps {
  conteudo?: Record<string, unknown>;
}

const Faq: React.FC<FaqProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Perguntas frequentes\nsobre sites';
  const tituloLines = titulo.split('\n');
  const itens = (Array.isArray(conteudo?.itens) ? (conteudo.itens as { pergunta?: string; resposta?: string }[]) : null)
    ?? FAQ_ITEMS.map((q) => ({ pergunta: q.question, resposta: q.answer }));

  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const gridStyle: React.CSSProperties = {
    ...innerStyleBase,
    gridTemplateColumns: isMd ? '1fr 1.2fr' : '1fr',
    gap: isMd ? spacing[12] : spacing[3],
    alignItems: 'start',
  };
  /** Em telas menores, sem padding horizontal e menos padding bottom na coluna do título/subtítulo */
  const leftColumnStyleResponsive: React.CSSProperties = {
    ...leftColumnStyle,
    paddingLeft: isMd ? spacing[12] : 0,
    paddingRight: isMd ? spacing[12] : 0,
    paddingBottom: isMd ? spacing[12] : spacing[2],
  };
  /** Em telas menores, menos padding top na coluna do accordion */
  const rightColumnStyleResponsive: React.CSSProperties = {
    ...rightColumnStyle,
    paddingLeft: isMd ? spacing[12] : 0,
    paddingRight: isMd ? spacing[12] : 0,
    paddingTop: isMd ? spacing[12] : spacing[3],
  };

  return (
    <section id="faq" style={sectionStyle} aria-labelledby="faq-heading">
      <div style={gridStyle}>
        <div style={leftColumnStyleResponsive}>
          <div style={badgeOuterStyle} role="status" aria-label="Seção FAQ">
            <span style={badgeInnerStyle}>FAQ</span>
            <span style={badgeOuterTextStyle}>Dúvidas sobre sites</span>
          </div>
          <h2 id="faq-heading" style={titleStyle}>
            {tituloLines.map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
            ))}
          </h2>
          <p style={descriptionStyle}>
            Tire suas dúvidas sobre prazo, pagamento e entrega. Ou converse direto conosco pelo WhatsApp.
          </p>
          <div style={{ alignSelf: isMd ? 'flex-start' : 'stretch', width: isMd ? undefined : '100%' }}>
            <ButtonCta
              href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE_DUVIDAS)}
              external
              label="Tirar dúvidas no WhatsApp"
              fullWidthOnMobile={!isMd}
            >
              Tirar dúvidas no WhatsApp
            </ButtonCta>
          </div>
        </div>

        <div style={rightColumnStyleResponsive}>
          <ul style={accordionListStyle} role="list">
          {itens.map((item, index) => {
            const isOpen = openIndex === index;
            const question = (item as { pergunta?: string; question?: string }).pergunta ?? (item as { question?: string }).question ?? '';
            const answer = (item as { resposta?: string; answer?: string }).resposta ?? (item as { answer?: string }).answer ?? '';
            return (
              <li key={index}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenIndex(isOpen ? null : index);
                    }
                  }}
                  style={{
                    backgroundColor: '#1a1a1c',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 30,
                    padding: `${spacing[5]}px ${spacing[6]}px`,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: spacing[4],
                    }}
                  >
                    <span
                      style={{
                        fontSize: fontSizes.lg,
                        fontWeight: 500,
                        color: colors.text.primary,
                        textAlign: 'left',
                        flex: 1,
                      }}
                    >
                      {question}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                      aria-hidden
                    >
                      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <linearGradient id={`faq-plus-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#49C0FF" />
                            <stop offset="100%" stopColor="#0280FF" />
                          </linearGradient>
                        </defs>
                        <path d="M5 12h14M12 5v14" stroke={`url(#faq-plus-grad-${index})`} />
                      </svg>
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <div style={{ overflow: 'hidden', minHeight: 0 }}>
                      <div
                        id={`faq-answer-${index}`}
                        role="region"
                        aria-labelledby={`faq-question-${index}`}
                        style={{ paddingTop: spacing[4] }}
                      >
                        <p
                          style={{
                            fontSize: fontSizes.sm,
                            lineHeight: 1.6,
                            color: colors.text.primary,
                            opacity: 0.85,
                            margin: 0,
                            textAlign: 'left',
                          }}
                        >
                          {answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Faq;
