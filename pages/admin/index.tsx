import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { theme } from '../../styles/theme';
import ButtonPainel from '../../components/ui/ButtonPainel';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { setAdminCache } from '../../lib/adminCache';

const { colors, spacing, fontSizes } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[8],
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 400,
  background: 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'saturate(150%) blur(14px)',
  WebkitBackdropFilter: 'saturate(150%) blur(14px)',
  border: `1px solid ${colors.neutral.border}`,
  borderRadius: 18,
  padding: spacing[8],
};

const logoWrapStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: spacing[6],
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
  color: colors.text.primary,
  marginBottom: spacing[1],
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[5]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.primary,
  backgroundColor: colors.neutral.accordeon,
  border: `1px solid ${colors.neutral.border}`,
  borderRadius: 6,
  outline: 'none',
};

const AdminLoginPage: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const [email, setEmail] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitize = (v: string, max: number) =>
    String(v)
      .slice(0, max)
      .replace(/[<>'"]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eTrim = email.trim();
    const cTrim = codigoAcesso.trim();
    if (!eTrim || !cTrim) {
      showError('Preencha e-mail e código de acesso.');
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
        showError(data.error || 'Erro ao fazer login.');
        return;
      }
      const meRes = await fetch('/api/admin/me', { credentials: 'same-origin' });
      const meData = meRes.ok ? await meRes.json() : null;
      if (meData) setAdminCache({ nome: meData.nome ?? null, email: meData.email });
      showSuccess('Login realizado com sucesso.');
      router.push('/admin/dashboard');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={pageStyle}>
        <div style={cardStyle} className="admin-login-card">
          <div style={logoWrapStyle}>
            <Image
              src="/images/brand/isologo-wefronti.webp"
              alt="Wefronti"
              width={140}
              height={38}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
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
                placeholder="e-mail de acesso"
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
            <ButtonPainel type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </ButtonPainel>
          </form>
        </div>
        <style jsx global>{`
          .admin-login-card input {
            -webkit-appearance: none;
            appearance: none;
          }
          .admin-login-card input:-webkit-autofill,
          .admin-login-card input:-webkit-autofill:hover,
          .admin-login-card input:-webkit-autofill:focus,
          .admin-login-card input:-webkit-autofill:active {
            -webkit-text-fill-color: #0a0a0a;
            -webkit-box-shadow: 0 0 0px 1000px #eff6ff inset;
            caret-color: #0a0a0a;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>
      </main>
    </>
  );
};

export default AdminLoginPage;
