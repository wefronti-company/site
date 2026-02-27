import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { theme } from '../../styles/theme';
import type { Proposal } from '../../lib/proposalData';
import { PROPOSAL_VALID_HOURS } from '../../lib/proposalData';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../../lib/whatsapp';

const { colors, spacing, fontSizes } = theme;

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'Expirada';
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}min restantes`;
  return `${m}min restantes`;
}

interface PropostaTemplateProps {
  proposal: Proposal & { codigo?: string };
  showCountdown?: boolean;
}

export const PropostaTemplate: React.FC<PropostaTemplateProps> = ({
  proposal,
  showCountdown = true,
}) => {
  const total = proposal.itens.reduce((s, i) => s + i.valor, 0);

  const [remaining, setRemaining] = useState<number>(0);
  useEffect(() => {
    const compute = () => {
      const sent = new Date(proposal.enviadoEm).getTime();
      const expiresAt = sent + PROPOSAL_VALID_HOURS * 60 * 60 * 1000;
      setRemaining(Math.max(0, expiresAt - Date.now()));
    };
    compute();
    const t = setInterval(compute, 60000); // atualiza a cada minuto
    return () => clearInterval(t);
  }, [proposal.enviadoEm]);

  const proposalWhatsAppUrl = buildWhatsAppUrl(
    DEFAULT_WHATSAPP_NUMBER,
    'Olá! Recebi a proposta comercial e gostaria de conversar.'
  );

  return (
    <div style={wrapStyle}>
      <header style={heroStyle}>
        <div style={heroContentStyle}>
          <Image
            src="/images/brand/isologo-wefronti.webp"
            alt="Wefronti"
            width={160}
            height={42}
            style={{ objectFit: 'contain', marginBottom: spacing[6] }}
          />
          <h1 style={heroTitleStyle}>Proposta comercial de desenvolvimento de site</h1>
          <p style={heroSubStyle}>Sua presença digital com qualidade e profissionalismo</p>
        </div>
      </header>

      <div style={cardStyle}>
        <article style={cardInnerStyle}>
        <section style={firstSectionStyle}>
          <div style={metaRowStyle}>
            {proposal.codigo && (
              <p style={codigoStyle}>Código: <strong>{proposal.codigo}</strong></p>
            )}
            {showCountdown && (
              <p style={remainingStyle}>
                Tempo restante: <strong>{formatRemaining(remaining)}</strong>
              </p>
            )}
          </div>
          <h2 style={titleStyle}>Proposta para</h2>
          <p style={clienteStyle}>{proposal.cliente}</p>
          {proposal.empresa && (
            <p style={empresaStyle}>{proposal.empresa}</p>
          )}
          <p style={dateStyle}>Emitida em {formatDate(proposal.enviadoEm)}</p>
        </section>

        <section style={sectionStyle}>
          <h3 style={tableTitleStyle}>Serviços</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Descrição</th>
                <th style={{ ...thStyle, ...thValueStyle }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {proposal.itens.map((item, i) => (
                <tr key={i}>
                  <td style={tdStyle}>{item.descricao}</td>
                  <td style={{ ...tdStyle, ...tdValueStyle }}>{formatBRL(item.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={totalRowStyle}>
            <span style={totalLabelStyle}>Total</span>
            <span style={totalValueStyle}>{formatBRL(total)}</span>
          </div>
        </section>

        {proposal.observacoes && (
          <section style={sectionStyle}>
            <p style={obsStyle}>{proposal.observacoes}</p>
          </section>
        )}

        <footer style={footerStyle}>
          <p style={footerTextStyle}>
            Esta proposta tem validade de 24 horas. Para aceitar ou esclarecer dúvidas, entre em contato.
          </p>
          <a
            href={proposalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={ctaStyle}
          >
            Falar no WhatsApp
          </a>
        </footer>
        </article>
      </div>
    </div>
  );
};

const wrapStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
};

const heroStyle: React.CSSProperties = {
  background: `linear-gradient(135deg, #0A0C12 0%, #131822 30%, #1a2332 60%, #0d1117 100%)`,
  padding: `${spacing[16]}px ${spacing[6]}px`,
  textAlign: 'center',
  position: 'relative' as const,
};

const heroContentStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  fontWeight: 700,
  color: '#fff',
  margin: 0,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
};

const heroSubStyle: React.CSSProperties = {
  margin: 0,
  marginTop: spacing[4],
  fontSize: fontSizes.lg,
  color: 'rgba(255,255,255,0.75)',
};

const cardStyle: React.CSSProperties = {
  maxWidth: 680,
  width: '100%',
  margin: '-40px auto 0',
  padding: `0 ${spacing[6]}px ${spacing[12]}px`,
  position: 'relative' as const,
  zIndex: 1,
};

const cardInnerStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 16,
  boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
  overflow: 'hidden',
};

const sectionStyle: React.CSSProperties = {
  padding: spacing[6],
};

const firstSectionStyle: React.CSSProperties = {
  ...sectionStyle,
  paddingTop: spacing[8],
};

const titleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
  marginBottom: spacing[2],
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  opacity: 0.8,
};

const clienteStyle: React.CSSProperties = {
  fontSize: fontSizes.xl,
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

const empresaStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  color: colors.text.primary,
  opacity: 0.8,
  margin: 0,
  marginTop: spacing[1],
};

const metaRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: spacing[4],
  marginBottom: spacing[4],
  paddingBottom: spacing[4],
  borderBottom: `1px solid ${colors.neutral.borderLight}`,
};

const codigoStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  margin: 0,
};

const remainingStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.blue.primary,
  margin: 0,
};

const dateStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.6,
  margin: 0,
  marginTop: spacing[3],
};

const tableTitleStyle: React.CSSProperties = {
  ...titleStyle,
  marginBottom: spacing[3],
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: `${spacing[2]} ${spacing[3]}`,
  fontSize: fontSizes.xs,
  fontWeight: 600,
  color: colors.text.primary,
  opacity: 0.7,
  borderBottom: `1px solid ${colors.neutral.borderLight}`,
};

const thValueStyle: React.CSSProperties = {
  textAlign: 'right',
  width: 120,
};

const tdStyle: React.CSSProperties = {
  padding: `${spacing[3]}`,
  fontSize: fontSizes.base,
  color: colors.text.primary,
  borderBottom: `1px solid ${colors.neutral.borderLight}`,
};

const tdValueStyle: React.CSSProperties = {
  textAlign: 'right',
};

const totalRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: spacing[4],
  paddingTop: spacing[4],
  borderTop: `2px solid ${colors.neutral.borderLight}`,
};

const totalLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.primary,
};

const totalValueStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 700,
  color: colors.blue.primary,
};

const obsStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.8,
  margin: 0,
};

const footerStyle: React.CSSProperties = {
  padding: spacing[6],
  backgroundColor: 'rgba(0,0,0,0.02)',
  borderTop: `1px solid ${colors.neutral.borderLight}`,
};

const footerTextStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.primary,
  opacity: 0.8,
  margin: 0,
  marginBottom: spacing[4],
};

const ctaStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: `${spacing[4]} ${spacing[8]}`,
  backgroundColor: '#25D366',
  color: '#fff',
  fontSize: fontSizes.base,
  fontWeight: 600,
  textDecoration: 'none',
  borderRadius: 10,
  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
};
