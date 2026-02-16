import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import ButtonCta from '../../components/ui/ButtonCta';

const { colors, spacing, fontSizes, radii, containerMaxWidth } = theme;

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

const rightColumnStyle: React.CSSProperties = {
  minWidth: 0,
  padding: spacing[12],
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  alignSelf: 'flex-start',
  padding: `${spacing[2]}px ${spacing[4]}px`,
  borderRadius: radii.md,
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

const descriptionStyle: React.CSSProperties = {
  fontSize: '1.3rem',
  lineHeight: 1.6,
  color: colors.text.light,
  opacity: 0.85,
  margin: 0,
};

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 560,
  padding: spacing[6],
  borderRadius: radii.md,
  border: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[5],
  textAlign: 'left',
  background: colors.neutral.accordeon,
};

const formRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[4],

};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  fontSize: fontSizes.base,
  color: colors.text.light,
  backgroundColor: colors.neutral.accordeon,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: radii.md,
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  marginBottom: spacing[2],
};

const textareaStyle: React.CSSProperties = {
  ...fieldStyle,
  minHeight: 120,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const privacyNoteStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.text.light,
  opacity: 0.6,
  margin: 0,
  marginTop: spacing[3],
  lineHeight: 1.5,
  textAlign: 'left',
};

const Contact: React.FC = () => {
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [formData, setFormData] = useState({
    nomeSobrenome: '',
    whatsapp: '',
    email: '',
    empresa: '',
    motivoContato: '',
  });

  const headerPaddingX = isMd ? spacing[12] : spacing[6];
  const sectionStyle: React.CSSProperties = {
    ...sectionStyleBase,
    paddingLeft: headerPaddingX,
    paddingRight: headerPaddingX,
  };
  const innerStyle: React.CSSProperties = {
    ...innerStyleBase,
    gridTemplateColumns: isMd ? '1fr 1.1fr' : '1fr',
  };
  const formRowLayout: React.CSSProperties = isMd
    ? formRowStyle
    : { display: 'flex', flexDirection: 'column', gap: spacing[4] };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: enviar para API ou e-mail
  };

  return (
    <section id="contato" style={sectionStyle} aria-labelledby="contact-heading">
      <div style={innerStyle}>
        <div style={leftColumnStyle}>
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
            Contato
          </span>
          <h2 id="contact-heading" style={titleStyle}>
            Vamos conversar?
          </h2>
          <p style={descriptionStyle}>
            Preencha o formulário e retornamos em breve. Sem compromisso — é só para entendermos sua necessidade.
          </p>
        </div>

        <div style={rightColumnStyle}>
          <form onSubmit={handleSubmit} style={formStyle} noValidate>
          <div style={formRowLayout}>
            <div>
              <label htmlFor="contact-nome" style={labelStyle}>
                Nome completo
              </label>
              <input
                id="contact-nome"
                name="nomeSobrenome"
                type="text"
                required
                autoComplete="name"
                value={formData.nomeSobrenome}
                onChange={handleChange}
                style={fieldStyle}
                className="contact-field"
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label htmlFor="contact-whatsapp" style={labelStyle}>
                WhatsApp
              </label>
              <input
                id="contact-whatsapp"
                name="whatsapp"
                type="tel"
                required
                autoComplete="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                style={fieldStyle}
                className="contact-field"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div style={formRowLayout}>
            <div>
              <label htmlFor="contact-email" style={labelStyle}>
                E-mail
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                style={fieldStyle}
                className="contact-field"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="contact-empresa" style={labelStyle}>
                Empresa
              </label>
              <input
                id="contact-empresa"
                name="empresa"
                type="text"
                autoComplete="organization"
                value={formData.empresa}
                onChange={handleChange}
                style={fieldStyle}
                className="contact-field"
                placeholder="Nome da empresa"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-motivo" style={labelStyle}>
              Conte sobre seu projeto
            </label>
            <textarea
              id="contact-motivo"
              name="motivoContato"
              value={formData.motivoContato}
              onChange={handleChange}
              style={textareaStyle}
              className="contact-field"
              placeholder="O que você precisa? Quais são seus desafios? Como podemos ajudar?"
              rows={5}
            />
          </div>

          <div style={{ marginTop: spacing[2], display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ButtonCta type="submit">Enviar mensagem</ButtonCta>
            <p style={privacyNoteStyle}>
              Seus dados estão seguros e não são compartilhados com terceiros.
              <br />
              Ao enviar, você concorda com nossa{' '}
              <a
                href="/politica-privacidade"
                style={{ color: colors.text.light, opacity: 0.9, textDecoration: 'none' }}
              >
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
