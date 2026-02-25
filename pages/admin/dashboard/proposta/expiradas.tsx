import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Proposal } from '../../../../lib/proposalData';
import { ExternalLink } from 'lucide-react';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
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

const btnStyle: React.CSSProperties = {
  padding: `${theme.spacing[2]}px ${theme.spacing[3]}px`,
  fontSize: theme.fontSizes.sm,
  fontWeight: 500,
  color: theme.colors.text.light,
  background: 'transparent',
  border: `1px solid ${theme.colors.neutral.borderDark}`,
  borderRadius: 6,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[2],
};

const btnAtivarStyle: React.CSSProperties = {
  ...btnStyle,
  color: theme.colors.blue.primary,
  borderColor: theme.colors.blue.primary,
};

let cachePropostasExpiradas: Proposal[] | null = null;

const PropostaExpiradasPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [propostas, setPropostas] = useState<Proposal[]>(() => cachePropostasExpiradas ?? []);
  const [loading, setLoading] = useState(() => !cachePropostasExpiradas);
  const [ativando, setAtivando] = useState<string | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/proposta/expiradas')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cachePropostasExpiradas = list;
        setPropostas(list);
      })
      .catch(() => {
        if (!cachePropostasExpiradas) setPropostas([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cachePropostasExpiradas });
  }, []);

  const handleReativar = async (slug: string) => {
    setAtivando(slug);
    try {
      const res = await fetch(`/api/proposta/${slug}/reativar`, { method: 'PATCH' });
      if (!res.ok) {
        showError('Erro ao reativar.');
        return;
      }
      load();
      showSuccess('Proposta reativada. Nova validade de 24 horas.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setAtivando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Propostas expiradas | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Propostas expiradas</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 76, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 76, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 76, opacity: 0.35 }} />
          </div>
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
                  <button
                    type="button"
                    style={btnAtivarStyle}
                    onClick={() => handleReativar(proposal.slug)}
                    disabled={!!ativando}
                  >
                    {ativando === proposal.slug ? '...' : 'Ativar'}
                  </button>
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
                  <Link href={`/admin/dashboard/proposta/${proposal.slug}/editar`} style={btnStyle}>
                    Editar
                  </Link>
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
