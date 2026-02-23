import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Proposal } from '../../../../lib/proposalData';
import { ExternalLink } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[6],
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[4],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[4],
};

const cardInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
};

const badgeExpiradaStyle: React.CSSProperties = {
  display: 'inline-flex',
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(248, 113, 113, 0.15)',
  color: '#f87171',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const PropostaExpiradasPage: React.FC = () => {
  const [propostas, setPropostas] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proposta/expiradas')
      .then((r) => r.json())
      .then((data) => {
        setPropostas(Array.isArray(data) ? data : []);
      })
      .catch(() => setPropostas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Propostas expiradas | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Propostas expiradas</h1>
        <p style={subtitleStyle}>
          Propostas com validade expirada há mais de 24 horas.
        </p>

        {loading ? (
          <p style={cardMetaStyle}>Carregando...</p>
        ) : propostas.length === 0 ? (
          <p style={cardMetaStyle}>Nenhuma proposta expirada.</p>
        ) : (
          <div style={listStyle}>
            {propostas.map((proposal) => {
              const total = proposal.itens.reduce((s, i) => s + i.valor, 0);
              const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/proposta/${proposal.slug}`;
              return (
                <div key={proposal.slug} style={cardStyle}>
                  <div style={cardInfoStyle}>
                    <span style={cardLabelStyle}>{proposal.empresa || proposal.cliente}</span>
                    <span style={cardMetaStyle}>
                      {proposal.codigo} · {proposal.cliente} · Enviada em {formatData(proposal.enviadoEm)}
                    </span>
                  </div>
                  <span style={cardLabelStyle}>{formatBRL(total)}</span>
                  <span style={badgeExpiradaStyle}>Expirada</span>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      color: colors.blue.primary,
                      textDecoration: 'none',
                      fontSize: fontSizes.sm,
                    }}
                  >
                    Ver proposta <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </AdminLayout>
    </>
  );
};

export default PropostaExpiradasPage;
