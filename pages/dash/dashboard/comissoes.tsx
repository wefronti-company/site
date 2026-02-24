import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashLayout from '../../../components/dash/DashLayout';
import { theme } from '../../../styles/theme';
import type { Comissao } from '../../../lib/comissaoDb';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
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
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  marginTop: spacing[1],
};

const receiptButtonStyle: React.CSSProperties = {
  marginTop: spacing[3],
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 8,
  background: 'rgba(53, 152, 255, 0.12)',
  color: colors.blue.primary,
  fontSize: fontSizes.xs,
  fontWeight: 600,
  textDecoration: 'none',
  padding: `${spacing[2]}px ${spacing[3]}px`,
  cursor: 'pointer',
};

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

let cacheDashComissoes: Comissao[] | null = null;

export default function DashComissoesPage() {
  const { usuario } = useDashUsuario();
  const [comissoes, setComissoes] = useState<Comissao[]>(() => cacheDashComissoes ?? []);
  const [loading, setLoading] = useState(() => !cacheDashComissoes);

  useEffect(() => {
    if (!usuario?.id) return;
    if (!cacheDashComissoes) setLoading(true);
    fetch('/api/usuario/comissoes', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        cacheDashComissoes = list;
        setComissoes(list);
      })
      .catch(() => {
        if (!cacheDashComissoes) setComissoes([]);
      })
      .finally(() => setLoading(false));
  }, [usuario?.id]);

  const totalRecebido = comissoes.reduce((acc, c) => acc + Number(c.valorComissao || 0), 0);

  return (
    <>
      <Head>
        <title>Minhas comissões | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <h1 style={titleStyle}>Minhas comissões</h1>
        <p style={subtitleStyle}>
          Comissões referentes às indicações que você fez. Quando um contrato for fechado com uma empresa indicada, a comissão aparecerá aqui.
        </p>
        {!loading && comissoes.length > 0 && (
          <p style={{ ...cardMetaStyle, marginTop: 0, marginBottom: spacing[4] }}>
            Total recebido: <strong style={{ color: colors.blue.primary }}>{formatBRL(totalRecebido)}</strong>
          </p>
        )}

        {!usuario ? null : loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 72, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 72, opacity: 0.45 }} />
          </div>
        ) : comissoes.length === 0 ? (
          <p style={cardMetaStyle}>Você ainda não possui comissões registradas.</p>
        ) : (
          <div style={listStyle}>
            {comissoes.map((c) => (
              <div key={c.id} style={cardStyle}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[2], alignItems: 'baseline' }}>
                  <span style={cardLabelStyle}>{c.empresaIndicada}</span>
                  <span style={{ color: colors.blue.primary, fontWeight: 600 }}>{formatBRL(c.valorComissao)}</span>
                </div>
                <p style={cardMetaStyle}>
                  Valor do contrato: {formatBRL(c.valorContrato)} · Registrado em {formatDate(c.criadoEm)}
                </p>
                <a
                  href={`/api/usuario/comissoes/${encodeURIComponent(c.id)}/comprovante`}
                  style={receiptButtonStyle}
                >
                  Baixar comprovante
                </a>
              </div>
            ))}
          </div>
        )}
      </DashLayout>
    </>
  );
}
