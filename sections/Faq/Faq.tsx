import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Plus } from 'lucide-react';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Em quanto tempo meu site vai estar no ar?',
    answer:
      'O prazo varia conforme o escopo. Uma landing page fica pronta em até 5 dias. Um site completo entre 14 e 21 dias. Trabalhamos com prazos reais sem enrolar e sem surpresas no meio do caminho.',
  },
  {
    question: 'O site vai aparecer no Google?',
    answer:
      'Sim. Todo projeto sai com SEO estruturado, não é opcional é obrigatório. Trabalhamos a arquitetura, os títulos, as descrições e a performance para o Google entender e ranquear o seu site.',
  },
  {
    question: 'Preciso ter todo o conteúdo pronto para começar?',
    answer:
      'Não necessariamente. No processo de onboarding mergulhamos no seu negócio e podemos te orientar sobre o conteúdo ideal. Quanto mais você nos passar, mais estratégico o resultado final.',
  },
  {
    question: 'O site vai funcionar bem no celular?',
    answer:
      'Todo site que entregamos é 100% responsivo e otimizado para mobile porque hoje mais de 60% dos acessos vêm do celular, e um site que trava no smartphone perde venda na hora.',
  },
  {
    question: 'E se eu precisar de ajuda depois que o site for entregue?',
    answer:
      'Garantimos suporte no lançamento para que tudo vá ao ar funcionando perfeitamente. Para melhorias e otimizações contínuas, temos planos de manutenção mensal disponíveis.',
  },
  {
    question: 'O site vai ser meu ou fico preso com vocês?',
    answer:
      'O site é 100% seu. Entregamos todos os acessos, credenciais e arquivos ao final do projeto sem dependência, sem armadilha.',
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
  display: 'grid',
  gap: spacing[12],
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
  padding: spacing[12],
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

const titleFadedStyle: React.CSSProperties = {
  opacity: 0.7,
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  lineHeight: 1.6,
  color: colors.text.light,
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

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'FAQ';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Perguntas\nfrequentes';
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
          <span style={badgeStyle} aria-hidden>
            <span className="badge-dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: colors.blue.primary }} />
            {badge}
          </span>
          <h2 id="faq-heading" style={titleStyle}>
            {tituloLines.map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
            ))}
          </h2>
          <p style={descriptionStyle}>
            Tem dúvidas? Confira as respostas mais comuns abaixo ou entre em contato pelo WhatsApp.
          </p>
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
                    background: colors.neutral.accordeon,
                    border: `1px solid ${colors.neutral.borderDark}`,
                    borderRadius: 30,
                    padding: `${spacing[5]}px ${spacing[6]}px`,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
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
                        color: colors.text.light,
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
                      <Plus size={22} strokeWidth={2.5} color={colors.text.light} />
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
                            color: colors.text.light,
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
