import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import SEO from '../components/SEO';
import { theme } from '../styles/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ButtonCta from '../components/ui/ButtonCta';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

const CONTACT_EMAIL = 'contato@wefronti.com';
const WHATSAPP_MESSAGE = 'Olá, vim pelo site e gostaria de entrar em contato.';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  paddingTop: 120,
  paddingBottom: spacing[16],
  backgroundColor: 'transparent',
};

const getContainerStyle = (paddingX: number): React.CSSProperties => ({
  width: '100%',
  maxWidth: containerMaxWidth.wide,
  margin: '0 auto',
  paddingLeft: paddingX,
  paddingRight: paddingX,
});

const backLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  marginBottom: spacing[8],
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.88,
  textDecoration: 'none',
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  alignSelf: 'flex-start',
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
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 400,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  color: colors.text.primary,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.2rem',
  lineHeight: 1.6,
  color: colors.text.primary,
  opacity: 0.88,
  margin: 0,
  maxWidth: 420,
};

const contactButtonsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 38,
};

const contactBtnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 20,
  padding: '16px 24px',
  borderRadius: radii.full,
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'saturate(180%) blur(20px)',
  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
  color: colors.text.primary,
  fontSize: fontSizes.base,
  fontWeight: 500,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s, transform 0.2s',
};

const formCardStyle: React.CSSProperties = {
  borderRadius: 24,
  border: `1px solid ${colors.neutral.border}`,
  backgroundColor: 'rgba(255, 255, 255, 0.25)',
  backdropFilter: 'saturate(180%) blur(24px)',
  WebkitBackdropFilter: 'saturate(180%) blur(24px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
  padding: spacing[8],
};

const Contato: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const paddingX = isMd ? spacing[12] : spacing[4];

  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    assunto: '',
    mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void (async () => {
      const nome = form.nome.trim();
      const sobrenome = form.sobrenome.trim();
      const email = form.email.trim();
      const assunto = form.assunto.trim();
      const mensagem = form.mensagem.trim();

      if (!nome || !sobrenome || !email || !assunto || !mensagem) {
        setFeedback({ type: 'error', message: 'Preencha todos os campos obrigatórios.' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFeedback({ type: 'error', message: 'Digite um e-mail válido.' });
        return;
      }

      try {
        setIsSubmitting(true);
        setFeedback(null);
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, sobrenome, email, assunto, mensagem }),
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setFeedback({ type: 'error', message: data.error || 'Erro ao enviar mensagem. Tente novamente.' });
          return;
        }
        setFeedback({ type: 'success', message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
        setForm({ nome: '', sobrenome: '', email: '', assunto: '', mensagem: '' });
      } catch {
        setFeedback({ type: 'error', message: 'Falha de conexão. Tente novamente.' });
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const layoutStyle: React.CSSProperties = isMd
    ? {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing[12],
        alignItems: 'start',
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[10],
      };

  const labelStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.primary,
  };

  const inputBaseStyle: React.CSSProperties = {
    borderRadius: 12,
    border: `1px solid ${colors.neutral.border}`,
    padding: '12px 14px',
    fontSize: fontSizes.base,
  };

  return (
    <>
      <SEO
        title="Contato"
        description="Entre em contato com a Wefronti. Tire dúvidas, solicite um orçamento ou converse sobre seu projeto."
      />
      <main style={pageStyle} aria-labelledby="contato-heading">
        <div style={getContainerStyle(paddingX)}>
         

          <div style={layoutStyle}>
            <div style={leftColumnStyle}>
              <span style={badgeStyle} aria-hidden>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: colors.blue.primary,
                  }}
                />
                Contato
              </span>
              <h1 id="contato-heading" style={titleStyle}>
                Fale com a gente
              </h1>
              <p style={subtitleStyle}>
                Prefere contato direto? Use os botões abaixo para enviar um e-mail ou iniciar uma conversa no WhatsApp.
              </p>

              <div style={contactButtonsStyle}>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="glass-transparent-sm"
                  style={contactBtnBase}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.blue.primary;
                    e.currentTarget.style.backgroundColor = colors.neutral.borderLight;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.neutral.border;
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Mail size={20} aria-hidden />
                  E-mail
                </a>
                <a
                  href={buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-transparent-sm"
                  style={contactBtnBase}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.blue.primary;
                    e.currentTarget.style.backgroundColor = colors.neutral.borderLight;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.neutral.border;
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <SiWhatsapp size={22} aria-hidden />
                  WhatsApp
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2], marginTop: spacing[4] }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[2] }}>
                  
                  <address style={{ fontStyle: 'normal', fontSize: fontSizes.sm, lineHeight: 1.6, color: colors.text.primary, opacity: 0.9, margin: 0 }}>
                    Avenida Cristóvão Colombo 2144, Sala 408, Andar 3<br />
                    Floresta, Porto Alegre – RS<br />
                    90560-001
                  </address>
                </div>
                <p style={{ fontSize: fontSizes.xs, color: colors.text.secondary, margin: 0, marginTop: spacing[1], opacity: 0.85 }}>
                  Atendimento somente online.
                </p>
              </div>
            </div>

            <div className="glass-transparent" style={formCardStyle}>
              <h2 style={{ margin: 0, marginBottom: spacing[6], fontSize: fontSizes.xl, fontWeight: 500, color: colors.text.primary }}>
                Envie sua mensagem
              </h2>
              <form noValidate onSubmit={handleSubmit} style={{ display: 'grid', gap: spacing[4] }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMd ? '1fr 1fr' : '1fr', gap: spacing[4] }}>
                  <label style={{ display: 'grid', gap: spacing[2] }}>
                    <span style={labelStyle}>Nome</span>
                    <input
                      className="pricing-modal-input"
                      value={form.nome}
                      onChange={(e) => updateField('nome', e.target.value)}
                      style={inputBaseStyle}
                    />
                  </label>
                  <label style={{ display: 'grid', gap: spacing[2] }}>
                    <span style={labelStyle}>Sobrenome</span>
                    <input
                      className="pricing-modal-input"
                      value={form.sobrenome}
                      onChange={(e) => updateField('sobrenome', e.target.value)}
                      style={inputBaseStyle}
                    />
                  </label>
                </div>

                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={labelStyle}>E-mail</span>
                  <input
                    className="pricing-modal-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    style={inputBaseStyle}
                  />
                </label>

                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={labelStyle}>Assunto</span>
                  <input
                    className="pricing-modal-input"
                    value={form.assunto}
                    onChange={(e) => updateField('assunto', e.target.value)}
                    placeholder="Ex: Orçamento, Dúvida, Parceria"
                    style={inputBaseStyle}
                  />
                </label>

                <label style={{ display: 'grid', gap: spacing[2] }}>
                  <span style={labelStyle}>Mensagem</span>
                  <textarea
                    className="pricing-modal-textarea"
                    value={form.mensagem}
                    onChange={(e) => updateField('mensagem', e.target.value)}
                    rows={5}
                    style={{
                      ...inputBaseStyle,
                      resize: 'vertical',
                      minHeight: 120,
                    }}
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
                  <ButtonCta type="submit" disabled={isSubmitting} hideIcon>
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
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
                      color: feedback?.type === 'error' ? '#DC2626' : '#059669',
                      opacity: feedback ? 1 : 0,
                      transition: 'opacity 0.2s ease',
                      textAlign: 'right',
                    }}
                  >
                    {feedback?.message ?? ' '}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contato;
