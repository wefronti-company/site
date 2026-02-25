import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { ClienteComPagamento } from '../../../../lib/clientDb';
import { buildWhatsAppUrl } from '../../../../lib/whatsapp';
import { MessageCircle, Mail } from 'lucide-react';

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

const badgeAtrasadaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(239, 68, 68, 0.15)',
  color: '#f87171',
  borderRadius: 8,
  fontSize: fontSizes.sm,
  fontWeight: 500,
};

const btnCobrancaStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
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

function getMesRefLabel(): string {
  const d = new Date();
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  return `${meses[d.getMonth()]} de ${d.getFullYear()}`;
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
  maxWidth: 420,
  width: '100%',
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

const btnModalStyle: React.CSSProperties = {
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
};

const btnWhatsAppStyle: React.CSSProperties = {
  ...btnModalStyle,
  backgroundColor: '#25D366',
  color: '#fff',
};

const btnEmailStyle: React.CSSProperties = {
  ...btnModalStyle,
  backgroundColor: colors.blue.primary,
  color: '#fff',
};

const btnFecharModalStyle: React.CSSProperties = {
  ...btnModalStyle,
  marginTop: spacing[2],
  backgroundColor: 'transparent',
  color: colors.text.light,
  border: `1px solid ${colors.neutral.borderDark}`,
};

let cacheClientesInadimplentes: ClienteComPagamento[] | null = null;

function buildCobrancaWhatsAppMessage(c: ClienteComPagamento): string {
  const valor = formatBRL(c.mensalidade);
  const venc = getVencimentoFormatado(c.criadoEm);
  const mes = getMesRefLabel();
  return `Olá! Segue lembrete da manutenção em aberto.\n\nValor: ${valor}\nVencimento: ${venc}\nReferência: ${mes}\n\nPor favor, efetue o pagamento quando possível.`;
}

function buildMailtoUrl(c: ClienteComPagamento): string {
  const valor = formatBRL(c.mensalidade);
  const venc = getVencimentoFormatado(c.criadoEm);
  const mes = getMesRefLabel();
  const subject = encodeURIComponent(`Lembrete: manutenção em aberto - ${c.nomeFantasia || c.razaoSocial || c.nome}`);
  const body = encodeURIComponent(
    `Olá,\n\nSegue lembrete da manutenção em aberto.\n\n` +
    `Valor: ${valor}\n` +
    `Vencimento: ${venc}\n` +
    `Referência: ${mes}\n\n` +
    `Por favor, efetue o pagamento quando possível.\n\nAtenciosamente.`
  );
  return `mailto:${encodeURIComponent(c.email)}?subject=${subject}&body=${body}`;
}

const ClientesInadiplentesPage: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteComPagamento[]>(() => cacheClientesInadimplentes ?? []);
  const [loading, setLoading] = useState(() => !cacheClientesInadimplentes);
  const [modalCliente, setModalCliente] = useState<ClienteComPagamento | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/clientes/inadimplentes')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheClientesInadimplentes = list;
        setClientes(list);
      })
      .catch(() => {
        if (!cacheClientesInadimplentes) setClientes([]);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load({ silent: !!cacheClientesInadimplentes });
  }, []);

  const temCelular = (c: ClienteComPagamento) => (c.celular || '').trim().replace(/\D/g, '').length >= 10;

  return (
    <>
      <Head>
        <title>Clientes inadimplentes | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Clientes inadimplentes</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : clientes.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum cliente inadimplente.</p>
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
                    <span style={cardMetaStyle}>{formatBRL(c.mensalidade)}</span>
                  </div>
                  <div style={cardColStyle}>
                    <span style={cardLabelStyle}>Vencimento</span>
                    <span style={cardMetaStyle}>{getVencimentoFormatado(c.criadoEm)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[4] }}>
                  <span style={badgeAtrasadaStyle}>Manutenção atrasada</span>
                  <button
                    type="button"
                    style={btnCobrancaStyle}
                    onClick={() => setModalCliente(c)}
                  >
                    Fazer cobrança
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalCliente && (
          <div
            style={overlayStyle}
            onClick={() => setModalCliente(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-cobranca-title"
          >
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <h2 id="modal-cobranca-title" style={modalTitleStyle}>Fatura em aberto</h2>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Cliente</span>
                <span style={modalValueStyle}>{modalCliente.nomeFantasia || modalCliente.razaoSocial || modalCliente.nome}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Valor</span>
                <span style={modalValueStyle}>{formatBRL(modalCliente.mensalidade)}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Vencimento</span>
                <span style={modalValueStyle}>{getVencimentoFormatado(modalCliente.criadoEm)}</span>
              </div>
              <div style={modalRowStyle}>
                <span style={modalLabelStyle}>Referência</span>
                <span style={modalValueStyle}>{getMesRefLabel()}</span>
              </div>
              <div style={modalActionsStyle}>
                {temCelular(modalCliente) ? (
                  <a
                    href={buildWhatsAppUrl(modalCliente.celular!, buildCobrancaWhatsAppMessage(modalCliente))}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btnWhatsAppStyle}
                  >
                    <MessageCircle size={20} /> Chamar no WhatsApp
                  </a>
                ) : (
                  <span style={{ ...cardMetaStyle, fontSize: fontSizes.sm }}>Celular não informado — cobrança apenas por e-mail.</span>
                )}
                <a
                  href={buildMailtoUrl(modalCliente)}
                  style={btnEmailStyle}
                >
                  <Mail size={20} /> Enviar e-mail
                </a>
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
};

export default ClientesInadiplentesPage;
