import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle2, X, Pencil } from 'lucide-react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';

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

const cardRightStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  flexShrink: 0,
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
  alignItems: 'center',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: spacing[4],
};

const modalStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[5],
  maxWidth: 480,
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const modalRowStyle: React.CSSProperties = {
  marginBottom: spacing[3],
};

const modalLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  marginBottom: spacing[1],
  display: 'block',
};

const modalValueStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  fontWeight: 500,
  color: colors.text.light,
};

const modalActionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
  marginTop: spacing[5],
};

const btnEditarStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  padding: `${spacing[3]}px ${spacing[4]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  borderRadius: 8,
  cursor: 'pointer',
  border: 'none',
  textDecoration: 'none',
  backgroundColor: colors.blue.primary,
  color: '#fff',
};

const btnFecharModalStyle: React.CSSProperties = {
  ...btnEditarStyle,
  backgroundColor: 'transparent',
  color: colors.text.light,
  border: `1px solid ${colors.neutral.borderDark}`,
};

function formaPagamentoLabel(v: string | undefined): string {
  if (!v) return '—';
  const map: Record<string, string> = {
    cartao: 'Cartão de crédito',
    pix: 'PIX',
    '50_50': '50% entrada / 50% entrega',
  };
  return map[v] ?? v;
}

const badgeRecorrenteStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#34D399',
  backgroundColor: '#1D3323',
  border: '1px solid rgba(52, 211, 153, 0.4)',
  borderRadius: 6,
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
};

const badgeCanceladoStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#9ca3af',
  backgroundColor: '#1f2937',
  border: '1px solid rgba(156, 163, 175, 0.4)',
  borderRadius: 6,
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
};

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

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function getDiaVencimento(criadoEm: string): number {
  const d = new Date(criadoEm);
  return isNaN(d.getTime()) ? 1 : d.getDate();
}

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

function getIniciais(c: ClienteComPagamento): string {
  const n = (c.nome || '').trim();
  if (!n) return (c.email || '?').charAt(0).toUpperCase();
  const palavras = n.split(/\s+/).filter(Boolean);
  if (palavras.length === 1) return palavras[0].charAt(0).toUpperCase();
  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

let cacheContratosTodos: ClienteComPagamento[] | null = null;

export default function ContratosTodosPage() {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheContratosTodos ?? []);
  const [loading, setLoading] = useState(() => !cacheContratosTodos);
  const [page, setPage] = useState(1);
  const [modalCliente, setModalCliente] = useState<ClienteComPagamento | null>(null);

  const totalPages = Math.max(1, Math.ceil(clientes.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  useEffect(() => {
    if (loading) {
      fetch('/api/clientes/ativos')
        .then((r) => r.json())
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          cacheContratosTodos = list;
          setClientes(list);
        })
        .catch(() => {
          if (!cacheContratosTodos) setClientes([]);
        })
        .finally(() => setLoading(false));
    }
  }, [loading]);

  return (
    <>
      <Head>
        <title>Todos os contratos | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Todos os contratos</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum contrato ativo no momento.</p>
        ) : (
          <>
          <div style={listStyle}>
            {paginate(clientes, page).map((c) => (
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
                    <span style={cardMetaStyle}>{formatBRL(c.precoManutencao ?? c.mensalidade)}</span>
                  </div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>Vencimento</span>
                    <span style={cardMetaStyle}>{getVencimentoFormatado(c.criadoEm)}</span>
                  </div>
                </div>
                <div style={cardRightStyle}>
                  {c.status === 2 ? (
                    <span style={badgeCanceladoStyle}>
                      <X size={16} /> Cancelado
                    </span>
                  ) : (c.mensalidade > 0 || (c.precoManutencao ?? 0) > 0) ? (
                    <span style={badgeRecorrenteStyle}>
                      <CheckCircle2 size={16} /> Recorrente
                    </span>
                  ) : null}
                  <button
                    type="button"
                    style={btnDetalhesStyle}
                    onClick={() => setModalCliente(c)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalItems={clientes.length} onPageChange={setPage} />
          </>
        )}

        {modalCliente && (
          <div
            style={overlayStyle}
            onClick={() => setModalCliente(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-contrato-title"
          >
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <h2 id="modal-contrato-title" style={modalTitleStyle}>Informações do contrato</h2>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Tipo de serviço</span>
                <span style={modalValueStyle}>{modalCliente.servicoTipo || '—'}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Preço do serviço</span>
                <span style={modalValueStyle}>{formatBRL(modalCliente.precoServico ?? 0)}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Manutenção</span>
                <span style={modalValueStyle}>{modalCliente.manutencao ? 'Sim' : 'Não'}</span>
              </div>
              {modalCliente.manutencao && (
                <div style={modalRowStyle}>
                  <span style={modalLabelStyle}>Preço da manutenção</span>
                  <span style={modalValueStyle}>{formatBRL(modalCliente.precoManutencao ?? modalCliente.mensalidade)}</span>
                </div>
              )}
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Forma de pagamento (projeto)</span>
                <span style={modalValueStyle}>{formaPagamentoLabel(modalCliente.formaPagamentoProjeto)}</span>
              </div>
              {modalCliente.formaPagamentoProjeto === 'cartao' && modalCliente.parcelasCartao != null && (
                <div style={modalRowStyle}>
                  <span style={modalLabelStyle}>Parcelas (cartão)</span>
                  <span style={modalValueStyle}>{modalCliente.parcelasCartao}x</span>
                </div>
              )}
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Dia de vencimento</span>
                <span style={modalValueStyle}>{getDiaVencimento(modalCliente.criadoEm)}º de cada mês</span>
              </div>
              <div style={modalActionsStyle}>
                <Link
                  href={`/admin/dashboard/contrato/${modalCliente.id}/editar`}
                  style={btnEditarStyle}
                >
                  <Pencil size={18} /> Editar contrato
                </Link>
                <button
                  type="button"
                  style={btnFecharModalStyle}
                  onClick={() => setModalCliente(null)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
