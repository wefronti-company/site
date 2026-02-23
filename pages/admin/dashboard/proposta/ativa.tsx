import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Proposal } from '../../../../lib/proposalData';
import { PROPOSAL_VALID_HOURS } from '../../../../lib/proposalData';
import { ExternalLink } from 'lucide-react';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

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

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#4ade80',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatRemaining(proposal: Proposal): string {
  const sent = new Date(proposal.enviadoEm).getTime();
  const expiresAt = sent + PROPOSAL_VALID_HOURS * 60 * 60 * 1000;
  const ms = Math.max(0, expiresAt - Date.now());
  if (ms <= 0) return 'Expirada';
  const h = Math.floor(ms / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (h > 0) return `${h}h ${m}min`;
  return `${m}min`;
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

const toggleWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing[2],
  fontSize: theme.fontSizes.sm,
  color: theme.colors.text.light,
};

const toggleTrackStyle = (active: boolean): React.CSSProperties => ({
  width: 44,
  height: 24,
  borderRadius: 12,
  backgroundColor: active ? theme.colors.blue.primary : 'rgba(255,255,255,0.2)',
  cursor: 'pointer',
  position: 'relative' as const,
  flexShrink: 0,
});

const toggleThumbStyle = (active: boolean): React.CSSProperties => ({
  position: 'absolute' as const,
  top: 2,
  left: active ? 22 : 2,
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#fff',
  transition: 'left 0.2s ease',
});

const PropostaAtivaPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [propostas, setPropostas] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = () => {
    fetch('/api/proposta/ativas')
      .then((r) => r.json())
      .then((data) => setPropostas(Array.isArray(data) ? data : []))
      .catch(() => {
        setPropostas([]);
        showError('Erro ao carregar propostas.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (slug: string, current: boolean) => {
    setToggling(slug);
    try {
      const res = await fetch(`/api/proposta/${slug}/link`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !current }),
      });
      if (!res.ok) {
        showError('Erro ao atualizar.');
        return;
      }
      load();
      showSuccess(current ? 'Link desativado.' : 'Link ativado.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <>
      <Head>
        <title>Propostas ativas | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Propostas ativas</h1>
        <p style={subtitleStyle}>
          Propostas válidas nas últimas 24 horas.
        </p>

        {loading ? (
          <p style={cardMetaStyle}>Carregando...</p>
        ) : propostas.length === 0 ? (
          <p style={cardMetaStyle}>Nenhuma proposta ativa no momento.</p>
        ) : (
          <div style={listStyle}>
            {propostas.map((proposal) => {
              const total = proposal.itens.reduce((s, i) => s + i.valor, 0);
              const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/proposta/${proposal.slug}`;
              const linkAtivo = proposal.linkAtivo !== false;
              return (
                <div key={proposal.slug} style={cardStyle}>
                  <div style={cardInfoStyle}>
                    <span style={cardLabelStyle}>{proposal.empresa || proposal.cliente}</span>
                    <span style={cardMetaStyle}>
                      {proposal.codigo} · {proposal.cliente}
                    </span>
                  </div>
                  <span style={cardLabelStyle}>{formatBRL(total)}</span>
                  <span style={badgeStyle}>{formatRemaining(proposal)} restantes</span>
                  <div style={toggleWrapStyle}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={linkAtivo}
                      disabled={!!toggling}
                      onClick={() => handleToggle(proposal.slug, linkAtivo)}
                      style={{
                        ...toggleTrackStyle(linkAtivo),
                        border: 'none',
                        padding: 0,
                      }}
                    >
                      <span style={toggleThumbStyle(linkAtivo)} />
                    </button>
                    <span>Link {linkAtivo ? 'ativo' : 'desativado'}</span>
                  </div>
                  {linkAtivo ? (
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
                  ) : (
                    <span style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.6 }}>
                      Link indisponível
                    </span>
                  )}
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

export default PropostaAtivaPage;
