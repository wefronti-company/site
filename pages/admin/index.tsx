import React, { useState } from 'react';
import Head from 'next/head';
import { theme } from '../../styles/theme';
import ButtonPainel from '../../components/ui/ButtonPainel';

const { colors, spacing, fontSizes } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.admin.background,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[8],
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 400,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[8],
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[6],
  textAlign: 'center',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  marginBottom: spacing[1],
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[5]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.background,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  outline: 'none',
};

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sanitize = (v: string, max: number) =>
    String(v)
      .slice(0, max)
      .replace(/[<>'"]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const eTrim = email.trim();
    const cTrim = codigoAcesso.trim();
    if (!eTrim || !cTrim) {
      setError('Preencha e-mail e código de acesso.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: sanitize(eTrim, 254),
          codigoAcesso: sanitize(cTrim, 64),
        }),
        credentials: 'same-origin',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login.');
        return;
      }
      window.location.href = '/admin/dashboard';
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Login</h1>
          <p style={subtitleStyle}>Acesso ao painel administrativo</p>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div>
              <label style={labelStyle} htmlFor="admin-email">
                E-mail
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(sanitize(e.target.value, 254))}
                placeholder="seu@email.com"
                maxLength={254}
                disabled={loading}
              />
            </div>
            <div>
              <label style={labelStyle} htmlFor="admin-codigo">
                Código de acesso
              </label>
              <input
                id="admin-codigo"
                type="password"
                autoComplete="current-password"
                style={inputStyle}
                value={codigoAcesso}
                onChange={(e) => setCodigoAcesso(sanitize(e.target.value, 64))}
                placeholder="••••••••"
                maxLength={64}
                disabled={loading}
              />
            </div>
            {error && (
              <p style={{ margin: 0, fontSize: fontSizes.sm, color: '#f87171' }}>{error}</p>
            )}
            <ButtonPainel type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </ButtonPainel>
          </form>
        </div>
      </main>
    </>
  );
};

export default AdminLoginPage;
