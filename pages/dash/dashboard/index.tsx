import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Users, Wallet, Banknote, Copy, Check } from 'lucide-react';
import DashLayout from '../../../components/dash/DashLayout';
import { theme } from '../../../styles/theme';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';
import type { Comissao } from '../../../lib/comissaoDb';

const { colors, spacing, fontSizes } = theme;

const cardWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: spacing[6],
  marginTop: spacing[6],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 16,
  padding: spacing[6],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
};

const cardValueStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
};

const linkBoxStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[3],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: 'rgba(18, 18, 18, 0.4)',
  backdropFilter: 'saturate(150%) blur(12px)',
  WebkitBackdropFilter: 'saturate(150%) blur(12px)',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
};

const linkInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  fontSize: fontSizes.sm,
  color: colors.text.light,
  outline: 'none',
};

const copyBtnStyle: React.CSSProperties = {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[2],
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  background: 'rgba(53, 152, 255, 0.15)',
  color: colors.blue.primary,
  cursor: 'pointer',
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

const getBaseUrl = (): string => {
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com').replace(/\/+$/, '');
};

export default function DashDashboardPage() {
  const { showSuccess } = useSnackbar();
  const { usuario, loading } = useDashUsuario();
  const [copied, setCopied] = useState(false);
  const [totalRecebido, setTotalRecebido] = useState(0);

  const ativo = usuario?.ativo !== false;
  const codigoRef = usuario?.codigoReferencia ? String(usuario.codigoReferencia).trim().toLowerCase() : '';
  const baseUrl = getBaseUrl();
  const linkIndicacao = ativo && codigoRef ? `${baseUrl}?ref=${encodeURIComponent(codigoRef)}` : '';

  const handleCopy = async () => {
    if (!linkIndicacao) return;
    try {
      await navigator.clipboard.writeText(linkIndicacao);
      setCopied(true);
      showSuccess('Link copiado!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showSuccess('Não foi possível copiar.');
    }
  };

  useEffect(() => {
    if (!usuario?.id) return;
    fetch('/api/usuario/comissoes', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list: Comissao[] = Array.isArray(data) ? data : [];
        const total = list.reduce((acc, c) => acc + Number(c.valorComissao || 0), 0);
        setTotalRecebido(total);
      })
      .catch(() => setTotalRecebido(0));
  }, [usuario?.id]);

  if (!usuario) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <section style={{ marginBottom: spacing[8] }}>
          <h2 style={{ fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', fontWeight: 600, color: colors.text.light, margin: 0, marginBottom: spacing[2] }}>
            Seu link de indicação
          </h2>
          {!ativo ? (
            <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, margin: 0, padding: spacing[4], backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: 8 }}>
              Seu link de indicação está temporariamente indisponível. Você continua com acesso ao dashboard e às suas comissões. Entre em contato para mais informações.
            </p>
          ) : (
            <>
              <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, margin: 0, marginBottom: spacing[4] }}>
                Compartilhe este link. Quando alguém fechar um contrato com a Wefronti usando seu link, você recebe 10% do valor.
              </p>
              <div style={linkBoxStyle} className="dash-link-box">
                <input
                  type="text"
                  readOnly
                  value={linkIndicacao}
                  style={linkInputStyle}
                  aria-label="Link de indicação"
                />
                <button
                  type="button"
                  style={copyBtnStyle}
                  onClick={handleCopy}
                  aria-label="Copiar link"
                  title="Copiar"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </>
          )}
        </section>

        <div style={cardWrapStyle}>
          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Users size={18} />
              Indicações
            </p>
            <p style={cardValueStyle}>{usuario.totalIndicacoes ?? 0}</p>
            <p style={{ margin: 0, fontSize: fontSizes.xs, color: colors.neutral.gray }}>
              Pessoas que acessaram seu link
            </p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Wallet size={18} />
              Comissões pendentes
            </p>
            <p style={cardValueStyle}>{formatBRL(0)}</p>
            <p style={{ margin: 0, fontSize: fontSizes.xs, color: colors.neutral.gray }}>
              Aguardando liberação
            </p>
          </div>

          <div style={cardStyle}>
            <p style={cardTitleStyle}>
              <Banknote size={18} />
              Comissões recebidas
            </p>
            <p style={cardValueStyle}>{formatBRL(totalRecebido)}</p>
            <p style={{ margin: 0, fontSize: fontSizes.xs, color: colors.neutral.gray }}>
              Total já pago
            </p>
          </div>
        </div>
      </DashLayout>
    </>
  );
}
