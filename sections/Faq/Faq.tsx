import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Plus } from 'lucide-react';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'Quanto tempo leva para desenvolver um site?',
    answer:
      'O prazo varia conforme o escopo. Um site institucional simples pode ficar pronto em 2 a 4 semanas. Projetos com mais páginas e funcionalidades podem levar de 6 a 12 semanas.',
  },
  {
    question: 'O que está incluso no desenvolvimento?',
    answer:
      'Incluímos planejamento, design, desenvolvimento responsivo, otimização para buscadores (SEO), integração com ferramentas de análise e suporte pós-entrega para ajustes iniciais.',
  },
  {
    question: 'Preciso ter o conteúdo pronto antes de começar?',
    answer:
      'Não é obrigatório. Podemos começar pela estrutura e design. Você pode enviar textos e imagens ao longo do projeto. Também podemos sugerir conteúdo ou adaptar o que você já tem.',
  },
  {
    question: 'O site funciona bem em celular?',
    answer:
      'Sim. Todos os sites que desenvolvemos são responsivos: se adaptam a celulares, tablets e desktops, com boa experiência de uso em qualquer dispositivo.',
  },
  {
    question: 'Como funciona a manutenção após a entrega?',
    answer:
      'Após a entrega, combinamos um período de suporte para ajustes. Depois, você pode contratar pacotes de manutenção para atualizações de conteúdo, segurança e melhorias contínuas.',
  },
  {
    question: 'Posso atualizar o conteúdo do site sozinho?',
    answer:
      'Depende do projeto. Podemos entregar com um painel de administração (CMS) para você editar textos e imagens, ou manter atualizações sob demanda, conforme sua necessidade.',
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

const Faq: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const headerPaddingX = isMd ? spacing[12] : spacing[4];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const gridStyle: React.CSSProperties = {
    ...innerStyleBase,
    gridTemplateColumns: isMd ? '1fr 1.2fr' : '1fr',
    alignItems: 'start',
  };
  /** Em telas menores, sem padding horizontal nas colunas para igualar à largura da seção Preços */
  const leftColumnStyleResponsive: React.CSSProperties = {
    ...leftColumnStyle,
    paddingLeft: isMd ? spacing[12] : 0,
    paddingRight: isMd ? spacing[12] : 0,
  };
  const rightColumnStyleResponsive: React.CSSProperties = {
    ...rightColumnStyle,
    paddingLeft: isMd ? spacing[12] : 0,
    paddingRight: isMd ? spacing[12] : 0,
  };

  return (
    <section id="faq" style={sectionStyle} aria-labelledby="faq-heading">
      <div style={gridStyle}>
        <div style={leftColumnStyleResponsive}>
          <span style={badgeStyle} aria-hidden>
            <span className="badge-dot-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: colors.blue.primary }} />
            FAQ
          </span>
          <h2 id="faq-heading" style={titleStyle}>
            Perguntas<br/>frequentes
          </h2>
          <p style={descriptionStyle}>
            Tem dúvidas? Confira as respostas mais comuns abaixo ou entre em contato pelo WhatsApp.
          </p>
        </div>

        <div style={rightColumnStyleResponsive}>
          <ul style={accordionListStyle} role="list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
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
                      {item.question}
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
                          {item.answer}
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
