import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Globe, Layout, Package, Plug } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii } = theme;

const PRICING_OPTIONS = [
  {
    key: 'desenvolvimento-web',
    title: 'Desenvolvimento Web',
    Icon: Globe,
    description:
      'Para empresas que precisam de presença digital com foco em resultado: sites estratégicos e lojas virtuais preparadas para converter.',
    price: '4.490,00',
    priceSecondary: 'Até 10x sem juros',

    cta: 'Quero projeto web',
    features: [
      'Site institucional',
      'Loja virtual responsiva',
      'SEO avançado',
      'Integração com gateways de pagamento',
      'Suporte pós-entrega',
    ],
  },
  {
    key: 'integracoes',
    title: 'Integrações & APIs',
    Icon: Plug,
    description:
      'Ideal para conectar ferramentas e automatizar operações: Gateways de pagamento, CRM, ERP, webhooks e fluxos internos.',
    price: 'Consultar',
    cta: 'Quero integração/API',
    features: [
      'Integração com Stripe/gateways',
      'Integração com CRM/ERP',
      'Webhooks e automações',
      'Sincronização de dados',
      'Validação e tratamento de falhas',
      'Documentação técnica básica',
    ],
  },
  {
    key: 'micro-saas',
    title: 'Micro-SaaS',
    Icon: Package,
    description:
      'Para validar e lançar produto digital escalável com cobrança recorrente, painel de cliente e base técnica para crescimento e pronto para escalar.',
    price: 'Consultar',
    cta: 'Quero Micro-SaaS',
    features: [
      'Arquitetura para produto SaaS',
      'Autenticação e gestão de usuários',
      'Planos e assinatura recorrente',
      'Área do cliente e painel admin',
      'Eventos e métricas iniciais',
      'Base pronta para evoluções',
    ],
  },
  {
    key: 'sistemas',
    title: 'Sistemas',
    Icon: Layout,
    description:
      'Para empresas que precisam de sistema sob medida: rastreio de encomendas, sistema interno, painel operacional e gestão personalizada.',
    price: 'Consultar',
    cta: 'Quero um sistema',
    features: [
      'Levantamento de requisitos',
      'Arquitetura e modelagem de dados',
      'Painel web responsivo',
      'Permissões por perfil de acesso',
      'Relatórios e visão operacional',
      'Suporte técnico inicial',
    ],
  },
] as const satisfies ReadonlyArray<{
  key: string;
  title: string;
  Icon: LucideIcon;
  description: string;
  price: string;
  cta: string;
  features: readonly string[];
  priceSecondary?: string;
  pricePix?: string;
}>;
type PricingOption = (typeof PRICING_OPTIONS)[number];

const sectionStyleBase: React.CSSProperties = {
  width: '100%',
  paddingTop: spacing[16],
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
};

const innerStyleBase: React.CSSProperties = {
  width: '100%',
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

const gridWrapStyle: React.CSSProperties = {
  width: '100%',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: spacing[6],
  alignItems: 'stretch',
};

const mobileCarouselWrapStyle: React.CSSProperties = {
  width: '100%',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: spacing[2],
};

const mobileCarouselTrackStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing[4],
  scrollSnapType: 'x mandatory',
  paddingRight: spacing[1],
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

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 500,
  color: colors.text.primary,
  margin: 0,
};

const cardIconWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  background: colors.neutral.borderLight,
  flexShrink: 0,
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
  fontWeight: 500,
  color: colors.text.primary,
};

const priceValueStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 4.5vw, 2.75rem)',
  fontWeight: 500,
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

const featureItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  transition: 'transform 0.2s ease',
};

const checkIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.blue.primary,
};

interface PricingProps {
  conteudo?: Record<string, unknown>;
}

const Pricing: React.FC<PricingProps> = ({ conteudo }) => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const headerPaddingX = isMd ? spacing[10] : spacing[4];
  const [isClient, setIsClient] = useState(false);
  const lockedScrollYRef = useRef(0);

  const badge = (conteudo?.badge != null ? String(conteudo.badge) : '') || 'Preços';
  const titulo = (conteudo?.titulo != null ? String(conteudo.titulo) : '') || 'Escolha a solução certa para a sua necessidade';
  const subtitulo = (conteudo?.subtitulo != null ? String(conteudo.subtitulo) : '') || 'Do projeto pontual ao produto completo: você escolhe a demanda, e nós estruturamos a entrega com escopo claro e valor justo.';

  const [modalOption, setModalOption] = useState<PricingOption | null>(null);
  const [leadForm, setLeadForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    whatsapp: '',
    investimento: '',
    tipoProjeto: '',
    contexto: '',
  });
  const [formFeedback, setFormFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = modalOption !== null;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    if (!isModalOpen) return;

    const body = document.body;
    const html = document.documentElement;
    lockedScrollYRef.current = window.scrollY;

    // Lock completo do scroll (inclui barra lateral).
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    body.classList.toggle('pricing-modal-open', isModalOpen);

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, lockedScrollYRef.current);
      body.classList.remove('pricing-modal-open');
    };
  }, [isModalOpen]);

  const openConsultModal = (option: PricingOption) => {
    setModalOption(option);
    setLeadForm({
      nome: '',
      sobrenome: '',
      email: '',
      whatsapp: '',
      investimento: '',
      tipoProjeto: '',
      contexto: '',
    });
    setFormFeedback(null);
    setLeadSubmitted(false);
  };

  const closeConsultModal = () => {
    setModalOption(null);
    setFormFeedback(null);
    setLeadSubmitted(false);
  };

  const updateLeadField = (field: keyof typeof leadForm, value: string) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
    if (formFeedback) setFormFeedback(null);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      if (!modalOption) return;
      const nome = leadForm.nome.trim();
      const sobrenome = leadForm.sobrenome.trim();
      const email = leadForm.email.trim();
      const whatsapp = leadForm.whatsapp.trim();
      const investimento = leadForm.investimento.trim();
      const tipoProjeto = leadForm.tipoProjeto.trim();
      const contexto = leadForm.contexto.trim();
      const requiresProjectType = modalOption.key === 'desenvolvimento-web';
      const requiresInvestment = modalOption.key !== 'desenvolvimento-web';

      if (!nome || !sobrenome || !email || !whatsapp || (requiresInvestment && !investimento) || (requiresProjectType && !tipoProjeto) || !contexto) {
        setFormFeedback({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormFeedback({ type: 'error', message: 'Digite um e-mail válido.' });
        return;
      }

      try {
        setIsSubmitting(true);
        setFormFeedback(null);
        const res = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: modalOption.title,
            nome,
            sobrenome,
            email,
            whatsapp,
            investimento: requiresInvestment ? investimento : null,
            tipoProjeto: requiresProjectType ? tipoProjeto : null,
            contexto,
            origem: 'pricing-modal',
          }),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          setFormFeedback({ type: 'error', message: data.error || 'Erro ao enviar solicitação. Tente novamente.' });
          return;
        }
        setLeadSubmitted(true);
      } catch {
        setFormFeedback({ type: 'error', message: 'Falha de conexão. Tente novamente.' });
      } finally {
        setIsSubmitting(false);
      }
    })();
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
    padding: isMd ? spacing[8] : spacing[6],
  };

  const cardStyleMobileCarousel: React.CSSProperties = {
    ...cardStyleResponsive,
    width: 'min(86vw, 360px)',
    flexShrink: 0,
    scrollSnapAlign: 'start',
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
          {isMd ? (
            <div style={grid}>
              {PRICING_OPTIONS.map((option) => (
                <div key={option.key} style={cardStyleResponsive}>
                  <div style={cardIconWrapStyle}>
                    <option.Icon size={24} color="#059669" strokeWidth={1.8} />
                  </div>
                  <h3 style={cardTitleStyle}>{option.title}</h3>
                  <p style={{ fontSize: fontSizes.sm, color: colors.text.primary, opacity: 0.88, margin: 0 }}>
                    {option.description}
                  </p>
                  <div style={priceBlockStyle}>
                    <p style={priceFromLabelStyle}>A partir de:</p>
                    <div style={priceRowStyle}>
                      {option.price === 'Consultar' ? null : <span style={priceSymbolStyle}>R$</span>}
                      <span style={priceValueStyle}>{option.price}</span>
                    </div>
                   
                  </div>
                  <ul style={featureListStyle}>
                    {option.features.map((text, i) => (
                      <li key={i} className="pricing-feature-item" style={featureItemStyle}>
                        <span style={checkIconStyle} aria-hidden>
                          <CheckCircle2 size={20} strokeWidth={2} />
                        </span>
                        {text}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <ButtonCta
                      label={option.cta}
                      onClick={() => openConsultModal(option)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={mobileCarouselWrapStyle}>
              <div style={mobileCarouselTrackStyle}>
                {PRICING_OPTIONS.map((option) => (
                  <div key={option.key} style={cardStyleMobileCarousel}>
                    <div style={cardIconWrapStyle}>
                      <option.Icon size={24} color="#059669" strokeWidth={1.8} />
                    </div>
                    <h3 style={cardTitleStyle}>{option.title}</h3>
                    <p style={{ fontSize: fontSizes.sm, color: colors.text.primary, opacity: 0.88, margin: 0 }}>
                      {option.description}
                    </p>
                    <div style={priceBlockStyle}>
                      <p style={priceFromLabelStyle}>A partir de:</p>
                      <div style={priceRowStyle}>
                        {option.price === 'Consultar' ? null : <span style={priceSymbolStyle}>R$</span>}
                        <span style={priceValueStyle}>{option.price}</span>
                      </div>                    
                  
                    </div>
                    <ul style={featureListStyle}>
                      {option.features.map((text, i) => (
                        <li key={i} className="pricing-feature-item" style={featureItemStyle}>
                          <span style={checkIconStyle} aria-hidden>
                            <CheckCircle2 size={20} strokeWidth={2} />
                          </span>
                          {text}
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: 'auto' }}>
                      <ButtonCta
                        label={option.cta}
                        onClick={() => openConsultModal(option)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {isClient && isModalOpen && modalOption ? createPortal(
        <div
          role="presentation"
          onClick={closeConsultModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(8, 12, 10, 0.5)',
            backdropFilter: 'saturate(145%) blur(8px)',
            WebkitBackdropFilter: 'saturate(145%) blur(8px)',
            zIndex: 2147483000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
          }}
        >
          <div
            role="dialog"
            aria-modal
            aria-labelledby={!leadSubmitted ? 'pricing-modal-title' : undefined}
            aria-label={leadSubmitted ? 'Solicitação enviada com sucesso' : undefined}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(720px, 100%)',
              maxHeight: '88vh',
              overflowY: 'auto',
              borderRadius: 24,
              border: `1px solid ${colors.neutral.border}`,
              background: '#F5FFF0',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
              padding: spacing[8],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4], marginBottom: spacing[6] }}>
              {!leadSubmitted ? (
                <h3 id="pricing-modal-title" style={{ margin: 0, fontSize: fontSizes['2xl'], color: colors.text.primary, fontWeight: 400 }}>
                  {`Orçamento para ${modalOption.title}`}
                </h3>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={closeConsultModal}
                aria-label="Fechar modal"
                style={{
                  border: `1px solid ${colors.neutral.border}`,
                  background: colors.neutral.accordeon,
                  color: colors.text.primary,
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  fontSize: 20,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {!leadSubmitted ? (
            <form noValidate onSubmit={handleLeadSubmit} style={{ display: 'grid', gap: spacing[4] }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr 1fr' : '1fr', gap: spacing[4] }}>
                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>Nome</span>
                  <input
                    className="pricing-modal-input"
                    value={leadForm.nome}
                    onChange={(e) => updateLeadField('nome', e.target.value)}
                    style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base }}
                  />
                </label>
                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>Sobrenome</span>
                  <input
                    className="pricing-modal-input"
                    value={leadForm.sobrenome}
                    onChange={(e) => updateLeadField('sobrenome', e.target.value)}
                    style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base }}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr 1fr' : '1fr', gap: spacing[4] }}>
                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>E-mail</span>
                  <input
                    className="pricing-modal-input"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => updateLeadField('email', e.target.value)}
                    style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base }}
                  />
                </label>
                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>WhatsApp</span>
                  <input
                    className="pricing-modal-input"
                    value={leadForm.whatsapp}
                    onChange={(e) => updateLeadField('whatsapp', e.target.value)}
                    style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base }}
                  />
                </label>
              </div>

              {modalOption.key === 'desenvolvimento-web' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing[4] }}>
                  <label style={{ display: 'grid', gap: spacing[2] }}>
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>Tipo de projeto</span>
                    <select
                      className="pricing-modal-select"
                      value={leadForm.tipoProjeto}
                      onChange={(e) => updateLeadField('tipoProjeto', e.target.value)}
                      style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base, background: '#fff' }}
                    >
                      <option value="" disabled>Selecione o tipo</option>
                      <option value="Site">Site</option>
                      <option value="Loja">Loja</option>
                    </select>
                  </label>
                </div>
              ) : (
                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>Valor para investimento</span>
                  <select
                    className="pricing-modal-select"
                    value={leadForm.investimento}
                    onChange={(e) => updateLeadField('investimento', e.target.value)}
                    style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base, background: '#fff' }}
                  >
                    <option value="" disabled>Selecione uma faixa</option>
                    <option value="R$ 10k a R$ 20k">R$ 10k a R$ 20k</option>
                    <option value="R$ 20k a R$ 40k">R$ 20k a R$ 40k</option>
                    <option value="R$ 40k a R$ 50k">R$ 40k a R$ 50k</option>
                  </select>
                </label>
              )}

              <label style={{ display: 'grid', gap: spacing[2] }}>
                <span style={{ fontSize: fontSizes.sm, color: colors.text.primary }}>Conte um pouco do que você precisa (problemas, cenário atual, objetivos)</span>
                <textarea
                  className="pricing-modal-textarea"
                  value={leadForm.contexto}
                  onChange={(e) => updateLeadField('contexto', e.target.value)}
                  rows={5}
                  style={{ borderRadius: 12, border: `1px solid ${colors.neutral.border}`, padding: '12px 14px', fontSize: fontSizes.base, resize: 'vertical', minHeight: 120 }}
                />
              </label>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: spacing[4],
                  marginTop: spacing[2],
                }}
              >
                <ButtonCta type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar orçamento'}
                </ButtonCta>
                <div
                  aria-live="polite"
                  style={{
                    flex: 1,
                    minHeight: 24,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    fontSize: fontSizes.sm,
                    color: formFeedback?.type === 'error' ? '#DC2626' : '#059669',
                    opacity: formFeedback ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    textAlign: 'right',
                  }}
                >
                  {formFeedback?.message ?? ' '}
                </div>
              </div>
            </form>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: spacing[5],
                  alignItems: 'center',
                  justifyItems: 'center',
                  textAlign: 'center',
                  paddingTop: spacing[6],
                  paddingBottom: spacing[4],
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(5, 150, 105, 0.14)',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                  }}
                  aria-hidden
                >
                  <CheckCircle2 size={28} color="#059669" />
                </div>
                <h4 style={{ margin: 0, fontSize: fontSizes['2xl'], color: colors.text.primary }}>
                  Solicitação enviada com sucesso!
                </h4>
                <p style={{ margin: 0, maxWidth: 560, fontSize: fontSizes.base, color: colors.text.primary, opacity: 0.9, lineHeight: 1.6 }}>
                  Recebemos seus dados para <strong>{modalOption.title}</strong>. Nossa equipe vai analisar seu cenário e retornar com os próximos passos do orçamento.
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      ) : null}
    </section>
  );
};

export default Pricing;
