import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ParticipanteListItem } from '../../../../lib/usuarioDb';
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

const badgeAtivoStyle: React.CSSProperties = {
  display: 'inline-flex',
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(34, 197, 94, 0.15)',
  color: '#4ade80',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

const badgeBanidoStyle: React.CSSProperties = {
  display: 'inline-flex',
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(156, 163, 175, 0.2)',
  color: '#9ca3af',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function getIniciais(p: ParticipanteListItem): string {
  const nome = (p.nomeCompleto || '').trim();
  if (!nome) return (p.email || '?').charAt(0).toUpperCase();
  const palavras = nome.split(/\s+/);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: colors.neutral.borderDark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.text.light,
  flexShrink: 0,
};

const btnStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  background: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  cursor: 'pointer',
  opacity: 0.8,
};

const btnDetalhesStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-flex',
};

let cacheParticipantesIndicacao: ParticipanteListItem[] | null = null;

export default function ParticipantesPage() {
  const { showSuccess, showError } = useSnackbar();
  const [list, setList] = useState<ParticipanteListItem[]>(() => cacheParticipantesIndicacao ?? []);
  const [loading, setLoading] = useState(() => !cacheParticipantesIndicacao);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/admin/indicacao/participantes', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const next = Array.isArray(data) ? data : [];
        cacheParticipantesIndicacao = next;
        setList(next);
      })
      .catch(() => {
        if (!cacheParticipantesIndicacao) setList([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheParticipantesIndicacao });
  }, []);

  const handleBanirReativar = async (id: string, ativo: boolean) => {
    setAtualizando(id);
    try {
      const res = await fetch(`/api/admin/indicacao/participantes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ativo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showError(data.error || 'Erro ao atualizar.');
        return;
      }
      load();
      showSuccess(ativo ? 'Participante reativado.' : 'Participante banido.');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <>
      <Head>
        <title>Participantes | Indique e Ganhe | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Participantes</h1>
        <p style={subtitleStyle}>
          Usuários cadastrados no programa Indique e Ganhe. Clique em Ver detalhes para editar os dados.
        </p>

        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 72, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 72, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 72, opacity: 0.35 }} />
          </div>
        ) : list.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum participante cadastrado.</p>
        ) : (
          <div style={listStyle}>
            {list.map((p) => (
              <div key={p.id} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4], flex: 1, minWidth: 0 }}>
                  <div style={avatarStyle}>{getIniciais(p)}</div>
                  <div style={cardInfoStyle}>
                    <span style={cardLabelStyle}>{p.nomeCompleto || p.email}</span>
                    <span style={cardMetaStyle}>
                      {p.codigoReferencia} · {p.email}
                    </span>
                  </div>
                </div>
                <span style={cardMetaStyle}>
                  {p.cliques} cliques · {formatBRL(p.valorPago)} pago · {formatBRL(p.valorPendente)} pendente
                </span>
                <span style={p.ativo ? badgeAtivoStyle : badgeBanidoStyle}>
                  {p.ativo ? 'Participante ativo' : 'Participante banido'}
                </span>
                <Link
                  href={`/admin/dashboard/indicacao/participantes/${p.id}/editar`}
                  style={btnDetalhesStyle}
                >
                  Ver detalhes
                </Link>
                {p.ativo ? (
                  <button
                    type="button"
                    style={{ ...btnStyle, color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.5)' }}
                    onClick={() => handleBanirReativar(p.id, false)}
                    disabled={!!atualizando}
                  >
                    {atualizando === p.id ? '...' : 'Banir participante'}
                  </button>
                ) : (
                  <button
                    type="button"
                    style={btnStyle}
                    onClick={() => handleBanirReativar(p.id, true)}
                    disabled={!!atualizando}
                  >
                    {atualizando === p.id ? '...' : 'Reativar'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
