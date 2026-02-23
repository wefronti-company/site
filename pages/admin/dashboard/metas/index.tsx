import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import ButtonPainel from '../../../../components/ui/ButtonPainel';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
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

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[4],
  maxWidth: 600,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const labelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};

const MetasPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [metaReceita, setMetaReceita] = useState('');
  const [metaClientes, setMetaClientes] = useState('');

  useEffect(() => {
    fetch('/api/metas')
      .then((r) => r.json())
      .then((data) => {
        setMetaReceita(String(data.metaReceita ?? ''));
        setMetaClientes(String(data.metaClientes ?? ''));
      })
      .catch(() => setError('Erro ao carregar metas.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const receita = parseFloat(metaReceita.replace(',', '.')) || 0;
    const clientes = parseInt(metaClientes, 10) || 0;
    if (clientes < 0 || receita < 0) {
      setError('Valores devem ser positivos.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/metas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metaReceita: receita,
          metaClientes: clientes,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erro ao salvar.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Erro ao conectar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Configurar metas | Wefronti Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.text.light, opacity: 0.7 }}>Carregando...</p>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Configurar metas | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Configurar metas</h1>
        <p style={subtitleStyle}>
          Defina as metas exibidas no dashboard.
        </p>

        <form className="metas-form" onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Meta de receita (R$)</label>
              <input
                type="text"
                inputMode="decimal"
                style={inputStyle}
                value={metaReceita}
                onChange={(e) => setMetaReceita(e.target.value)}
                placeholder="0"
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Meta de clientes ativos</label>
              <input
                type="number"
                min={0}
                style={inputStyle}
                value={metaClientes}
                onChange={(e) => setMetaClientes(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, marginTop: spacing[4], fontSize: fontSizes.sm, color: '#f87171' }}>
              {error}
            </p>
          )}

          {success && (
            <p
              style={{
                margin: 0,
                marginTop: spacing[4],
                fontSize: fontSizes.sm,
                color: '#4ade80',
              }}
            >
              Metas salvas com sucesso.
            </p>
          )}

          <div style={{ marginTop: spacing[6] }}>
            <ButtonPainel type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar metas'}
            </ButtonPainel>
          </div>
        </form>

        <style jsx global>{`
          .metas-form input:focus {
            outline: none;
            box-shadow: none;
          }
        `}</style>
      </AdminLayout>
    </>
  );
};

export default MetasPage;
