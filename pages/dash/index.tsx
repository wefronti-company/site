import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';
import ButtonPainel from '../../components/ui/ButtonPainel';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { toDashUrl } from '../../lib/dash-url';

const { spacing, fontSizes, radii } = theme;

const sanitize = (v: string, max: number) =>
  String(v)
    .slice(0, max)
    .replace(/[<>'"]/g, '');

type Mode = 'login' | 'criar';

const DashLoginPage: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const eTrim = email.trim().toLowerCase();
    if (!eTrim || !senha) {
      showError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cliente/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sanitize(eTrim, 254), senha }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'E-mail ou senha incorretos. Tente novamente.');
        return;
      }
      showSuccess('Login realizado com sucesso.');
      if (typeof window !== 'undefined' && window.location.hostname === 'painel.wefronti.com') {
        window.location.href = toDashUrl('/dashboard');
      } else {
        router.push('/dash/dashboard');
      }
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const eTrim = email.trim().toLowerCase();
    if (!nomeCompleto.trim()) {
      showError('Preencha o nome.');
      return;
    }
    if (!eTrim || !senha) {
      showError('Preencha e-mail e senha.');
      return;
    }
    if (senha !== confirmarSenha) {
      showError('As senhas não conferem.');
      return;
    }
    if (senha.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cliente/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: sanitize(nomeCompleto.trim(), 200),
          email: sanitize(eTrim, 254),
          senha,
        }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Erro ao criar conta. Tente novamente.');
        return;
      }
      showSuccess('Conta criada com sucesso! Faça login.');
      setMode('login');
      setNomeCompleto('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    backdropFilter: 'saturate(150%) blur(12px)',
    WebkitBackdropFilter: 'saturate(150%) blur(12px)',
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: radii.full,
    outline: 'none',
  };

  const inputWithIconStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: 48,
  };

  const passwordToggleBtnStyle: React.CSSProperties = {
    position: 'absolute',
    right: spacing[2],
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing[1],
    color: colors.neutral.gray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundImage: "url('/images/brand/background-login.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: '1',
    minWidth: 0,
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[12],
  };

  const leftPanelContentStyle: React.CSSProperties = {
    maxWidth: 480,
    textAlign: 'center',
  };

  const leftTitleStyle: React.CSSProperties = {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    fontWeight: 400,
    color: '#ffffff',
    lineHeight: 1.2,
    marginBottom: spacing[4],
  
  };

  const leftSubtitleStyle: React.CSSProperties = {
    fontSize: fontSizes.lg,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.5,
  
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: '1',
    minWidth: 320,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  };

  const formCardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
  };

  const formCardBorderStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 440,
    padding: spacing[8],
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: 30,
    backgroundColor: 'rgba(17, 21, 32, 0.35)',
    backdropFilter: 'saturate(150%) blur(16px)',
    WebkitBackdropFilter: 'saturate(150%) blur(16px)',
  };

  const logoWrapStyle: React.CSSProperties = {
    marginBottom: spacing[8],
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const linkStyle: React.CSSProperties = {
    color: colors.blue.primary,
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 500,
  };

  const voltarAoSiteStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[6],
    paddingTop: spacing[4],
    borderTop: `1px solid ${colors.neutral.borderDark}`,
    width: '100%',
    justifyContent: 'center',
    fontSize: fontSizes.sm,
    color: colors.text.light,
    opacity: 0.9,
    textDecoration: 'none',
  };

  return (
    <>
      <Head>
        <title>{mode === 'login' ? 'Entrar' : 'Criar conta'} | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={containerStyle} className="dash-login-page">
        <div style={leftPanelStyle} className="dash-login-left">
          <div style={leftPanelContentStyle}>
            <h2 style={leftTitleStyle}>
              Área do cliente
            </h2>
            <p style={leftSubtitleStyle}>
              Acesse sua conta para acompanhar seu contrato, serviços e pagamentos.
            </p>
          </div>
        </div>
        <div style={rightPanelStyle}>
          <div style={formCardBorderStyle}>
          <div style={formCardStyle}>
            <div style={logoWrapStyle}>
              <Image
                src="/images/brand/isologo-white.webp"
                alt="Wefronti"
                width={140}
                height={38}
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[4] }}>
              {mode === 'login' ? 'Acesse sua conta' : 'Criar conta'}
            </h1>
            {mode === 'login' ? (
              <form onSubmit={handleLogin} style={formStyle}>
                <div>
                  <label style={labelStyle} htmlFor="dash-email">E-mail</label>
                  <input
                    id="dash-email"
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
                  <label style={labelStyle} htmlFor="dash-senha">Senha</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="dash-senha"
                      type={showSenha ? 'text' : 'password'}
                      autoComplete="current-password"
                      style={inputWithIconStyle}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="dash-pw-toggle"
                      aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                      style={passwordToggleBtnStyle}
                      onClick={() => setShowSenha((v) => !v)}
                    >
                      {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <p style={{ margin: 0, marginTop: spacing[2], marginBottom: 0 }}>
                  <Link
                    href="/esqueci-senha"
                    style={{ ...linkStyle, fontSize: fontSizes.sm, fontWeight: 400 }}
                  >
                    Esqueceu senha?
                  </Link>
                </p>
                <ButtonPainel type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </ButtonPainel>
                <p style={{ margin: 0, textAlign: 'center', fontSize: fontSizes.sm, color: colors.text.light }}>
                  Não tem conta?{' '}
                  <button type="button" style={{ ...linkStyle, background: 'none', border: 'none', padding: 0 }} onClick={() => setMode('criar')}>
                    Criar conta
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegistro} style={formStyle}>
                <div>
                  <label style={labelStyle} htmlFor="dash-nome">Nome completo</label>
                  <input
                    id="dash-nome"
                    type="text"
                    autoComplete="name"
                    style={inputStyle}
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(sanitize(e.target.value, 200))}
                    placeholder="Seu nome"
                    maxLength={200}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="dash-reg-email">E-mail</label>
                  <input
                    id="dash-reg-email"
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
                  <label style={labelStyle} htmlFor="dash-reg-senha">Senha</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="dash-reg-senha"
                      type={showSenha ? 'text' : 'password'}
                      autoComplete="new-password"
                      style={inputWithIconStyle}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="dash-pw-toggle"
                      aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                      style={passwordToggleBtnStyle}
                      onClick={() => setShowSenha((v) => !v)}
                    >
                      {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="dash-reg-confirmar">Confirmar senha</label>
                  <input
                    id="dash-reg-confirmar"
                    type={showSenha ? 'text' : 'password'}
                    autoComplete="new-password"
                    style={inputStyle}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    disabled={loading}
                  />
                </div>
                <ButtonPainel type="submit" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </ButtonPainel>
                <p style={{ margin: 0, textAlign: 'center', fontSize: fontSizes.sm, color: colors.text.light }}>
                  Já tem conta?{' '}
                  <button type="button" style={{ ...linkStyle, background: 'none', border: 'none', padding: 0 }} onClick={() => setMode('login')}>
                    Entrar
                  </button>
                </p>
              </form>
            )}
            <Link href="/" style={voltarAoSiteStyle} aria-label="Voltar ao site">
              <ArrowLeft size={18} strokeWidth={2} aria-hidden />
              Voltar ao site
            </Link>
          </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        @media (min-width: 768px) {
          .dash-login-left {
            display: flex !important;
          }
        }
        .dash-login-page input {
          -webkit-appearance: none;
          appearance: none;
        }
        .dash-login-page input:-webkit-autofill,
        .dash-login-page input:-webkit-autofill:hover,
        .dash-login-page input:-webkit-autofill:focus,
        .dash-login-page input:-webkit-autofill:active {
          -webkit-text-fill-color: #ffffff;
          -webkit-box-shadow: 0 0 0px 1000px #0A0C12 inset;
          caret-color: #ffffff;
          transition: background-color 5000s ease-in-out 0s;
        }
        .dash-login-page .dash-pw-toggle:hover {
          color: #ffffff;
        }
      `}</style>
    </>
  );
};

export default DashLoginPage;
