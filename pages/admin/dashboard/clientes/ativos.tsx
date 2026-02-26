import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { CheckCircle2, X, AlertTriangle } from 'lucide-react';

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
  padding: spacing[5],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[5],
};

const cardLeftStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '44px minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(48px, 0.5fr) minmax(90px, 1fr) minmax(90px, 1fr)',
  alignItems: 'center',
  columnGap: spacing[8],
  flex: 1,
  minWidth: 0,
};

const cardColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  minWidth: 0,
  overflow: 'hidden',
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
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const,
};

const cardUfStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  minWidth: 32,
};

const badgeEmDiaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#34D399',
  backgroundColor: '#1D3323',
  border: '1px solid rgba(52, 211, 153, 0.4)',
  borderRadius: 6,
};

const badgeVenceHojeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#eab308',
  backgroundColor: '#422006',
  border: '1px solid rgba(234, 179, 8, 0.5)',
  borderRadius: 6,
};

const badgeEmAtrasoStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  color: '#f87171',
  borderRadius: 6,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

/** Data de vencimento do mês atual (DD/MM/AAAA). */
function getVencimentoFormatado(criadoEm: string): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;
  const diaVenc = getDiaVencimento(criadoEm);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const dia = Math.min(diaVenc, ultimoDia);
  const dd = String(dia).padStart(2, '0');
  const mm = String(mes).padStart(2, '0');
  return `${dd}/${mm}/${ano}`;
}

/** Data de vencimento do mês atual (objeto Date à meia-noite). */
function getDataVencimentoMesAtual(criadoEm: string): Date {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth() + 1;
  const diaVenc = getDiaVencimento(criadoEm);
  const ultimoDia = new Date(ano, mes, 0).getDate();
  const dia = Math.min(diaVenc, ultimoDia);
  const venc = new Date(ano, mes - 1, dia);
  venc.setHours(0, 0, 0, 0);
  return venc;
}

/** True se hoje já passou da data de vencimento do mês atual. */
function isVencido(criadoEm: string): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = getDataVencimentoMesAtual(criadoEm);
  return hoje.getTime() > venc.getTime();
}

/** True se a data de vencimento do mês atual é hoje. */
function venceHoje(criadoEm: string): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = getDataVencimentoMesAtual(criadoEm);
  return hoje.getTime() === venc.getTime();
}

/** Estado do badge para cliente ativo: em_dia | vence_hoje | em_atraso (só para quem tem mensalidade e não pagou). */
function getEstadoBadge(c: ClienteComPagamento): 'em_dia' | 'vence_hoje' | 'em_atraso' {
  if (c.mensalidadePaga) return 'em_dia';
  if (c.mensalidade <= 0) return 'em_dia';
  if (venceHoje(c.criadoEm)) return 'vence_hoje';
  if (isVencido(c.criadoEm)) return 'em_atraso';
  return 'em_dia';
}

function getIniciais(c: ClienteComPagamento): string {
  const n = (c.nome || '').trim();
  if (!n) return (c.email || '?').charAt(0).toUpperCase();
  const palavras = n.split(/\s+/).filter(Boolean);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: 'rgba(53, 152, 255, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.blue.primary,
  flexShrink: 0,
};

let cacheClientesAtivos: ClienteComPagamento[] | null = null;

const ClientesAtivosPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesAtivos ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesAtivos);
  const [page, setPage] = useState(1);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/ativos')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesAtivos = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesAtivos) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesAtivos });
  }, []);

  const totalPages = Math.max(1, Math.ceil(clientes.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <Head>
        <title>Clientes ativos | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Clientes ativos</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente ativo no momento.</p>
        ) : (
          <>
          <div style={listStyle}>
            {paginate(clientes, page).map((c) => {
              const estado = getEstadoBadge(c);
              return (
                <div key={c.id} style={cardStyle}>
                  <div style={cardLeftStyle}>
                    <div style={avatarStyle}>{getIniciais(c)}</div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Nome do cliente</span>
                      <span style={cardMetaStyle}>{c.nome}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>E-mail</span>
                      <span style={cardMetaStyle} title={c.email}>{c.email}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>UF</span>
                      <span style={cardUfStyle}>{c.enderecoUf || '—'}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Manutenção</span>
                      <span style={cardMetaStyle}>{formatBRL(c.mensalidade)}</span>
                    </div>
                    <div style={cardColStyle}>
                      <span style={cardLabelStyle}>Vencimento</span>
                      <span style={cardMetaStyle}>{getVencimentoFormatado(c.criadoEm)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {estado === 'em_dia' && (
                      <span style={badgeEmDiaStyle}>
                        <CheckCircle2 size={16} /> Em dia
                      </span>
                    )}
                    {estado === 'vence_hoje' && (
                      <span style={badgeVenceHojeStyle}>
                        <AlertTriangle size={16} /> Vence hoje
                      </span>
                    )}
                    {estado === 'em_atraso' && (
                      <span style={badgeEmAtrasoStyle}>
                        <X size={16} /> Em atraso
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination currentPage={page} totalItems={clientes.length} onPageChange={setPage} />
          </>
        )}
      </AdminLayout>
    </>
  );
};

export default ClientesAtivosPage;
