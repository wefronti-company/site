import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle2, X } from 'lucide-react';
import AdminLayout from '../../../../components/admin/AdminLayout';
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
  display: 'flex',
  alignItems: 'center',
  gap: spacing[8],
  flex: 1,
  minWidth: 0,
};

const cardColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  minWidth: 0,
  paddingRight: spacing[4],
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

  useEffect(() => {
    if (loading) {
      fetch('/api/clientes/todos')
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
          <p style={cardMetaStyle}>Nenhum contrato cadastrado.</p>
        ) : (
          <div style={listStyle}>
            {clientes.map((c) => (
              <div key={c.id} style={cardStyle}>
                <div style={cardLeftStyle}>
                  <div style={avatarStyle}>{getIniciais(c)}</div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>Nome do cliente</span>
                    <span style={cardMetaStyle}>{c.nome}</span>
                  </div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>E-mail</span>
                    <span style={cardMetaStyle}>{c.email}</span>
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
                  <Link
                    href={`/admin/dashboard/clientes/${c.id}/detalhes`}
                    style={btnDetalhesStyle}
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
