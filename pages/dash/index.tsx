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

const { spacing, fontSizes, radii } = theme;

type FormMode = 'login' | 'register';

const sanitize = (v: string, max: number) =>
  String(v)
    .slice(0, max)
    .replace(/[<>'"]/g, '');

const DashLoginPage: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const [mode, setMode] = useState<FormMode>('login');
  const [loading, setLoading] = useState(false);

  // Login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  // Register
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regSenhaConfirmar, setRegSenhaConfirmar] = useState('');
  const [showRegSenha, setShowRegSenha] = useState(false);
  const [showRegSenhaConfirm, setShowRegSenhaConfirm] = useState(false);
  const [aceitoTermos, setAceitoTermos] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const eTrim = email.trim().toLowerCase();
    if (!eTrim || !senha) {
      showError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/usuario/login', {
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
      router.push('/dashboard');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNome.trim()) {
      showError('Preencha o nome.');
      return;
    }
    if (!regEmail.trim()) {
      showError('Preencha o e-mail.');
      return;
    }
    if (regSenha.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (regSenha !== regSenhaConfirmar) {
      showError('As senhas não conferem.');
      return;
    }
    if (!aceitoTermos) {
      showError('Aceite os Termos de Uso e a Política de Privacidade para criar sua conta.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: regNome.trim(),
          email: regEmail.trim().toLowerCase(),
          senha: regSenha,
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
      setEmail(regEmail.trim().toLowerCase());
      setRegNome('');
      setRegEmail('');
      setRegSenha('');
      setRegSenhaConfirmar('');
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

  const toggleStyle: React.CSSProperties = {
    marginTop: spacing[4],
    textAlign: 'center',
    fontSize: fontSizes.sm,
    color: colors.text.light,
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
              Indique clientes e ganhe recompensas
            </h2>
            <p style={leftSubtitleStyle}>
              Acesse sua área exclusiva do programa de indicação e comece a indicar hoje.
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
            {mode === 'login' ? (
              <>
                <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[4] }}>
                  Acesse sua conta
                </h1>
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
                </form>
                <p style={toggleStyle}>
                  Não tem conta?{' '}
                  <a
                    style={linkStyle}
                    role="button"
                    tabIndex={0}
                    onClick={() => setMode('register')}
                    onKeyDown={(e) => e.key === 'Enter' && setMode('register')}
                  >
                    Criar conta
                  </a>
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[4] }}>
                  Criar conta
                </h1>
                <form onSubmit={handleRegister} style={formStyle}>
                  <div>
                    <label style={labelStyle} htmlFor="reg-nome">Nome</label>
                    <input
                      id="reg-nome"
                      type="text"
                      autoComplete="name"
                      style={inputStyle}
                      value={regNome}
                      onChange={(e) => setRegNome(sanitize(e.target.value, 200))}
                      placeholder="Seu nome completo"
                      maxLength={200}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="reg-email">E-mail</label>
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      style={inputStyle}
                      value={regEmail}
                      onChange={(e) => setRegEmail(sanitize(e.target.value, 254))}
                      placeholder="seu@email.com"
                      maxLength={254}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="reg-senha">Senha</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="reg-senha"
                        type={showRegSenha ? 'text' : 'password'}
                        autoComplete="new-password"
                        style={inputWithIconStyle}
                        value={regSenha}
                        onChange={(e) => setRegSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="dash-pw-toggle"
                        aria-label={showRegSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        style={passwordToggleBtnStyle}
                        onClick={() => setShowRegSenha((v) => !v)}
                      >
                        {showRegSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="reg-senha-confirm">Confirmar senha</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="reg-senha-confirm"
                        type={showRegSenhaConfirm ? 'text' : 'password'}
                        autoComplete="new-password"
                        style={inputWithIconStyle}
                        value={regSenhaConfirmar}
                        onChange={(e) => setRegSenhaConfirmar(e.target.value)}
                        placeholder="Repita a senha"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="dash-pw-toggle"
                        aria-label={showRegSenhaConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                        style={passwordToggleBtnStyle}
                        onClick={() => setShowRegSenhaConfirm((v) => !v)}
                      >
                        {showRegSenhaConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: spacing[2], marginBottom: spacing[2], cursor: 'pointer', fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.95 }}>
                    <input
                      type="checkbox"
                      checked={aceitoTermos}
                      onChange={(e) => setAceitoTermos(e.target.checked)}
                      style={{ marginTop: 4, flexShrink: 0 }}
                      disabled={loading}
                      aria-describedby="termos-label"
                    />
                    <span id="termos-label">
                      Li e aceito os{' '}
                      <Link href="/termos-de-uso" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                        Termos de Uso
                      </Link>
                      {' '}e a{' '}
                      <Link href="/politica-privacidade" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                        Política de Privacidade
                      </Link>
                      .
                    </span>
                  </label>
                  <ButtonPainel type="submit" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </ButtonPainel>
                </form>
                <p style={toggleStyle}>
                  Já tem conta?{' '}
                  <a
                    style={linkStyle}
                    role="button"
                    tabIndex={0}
                    onClick={() => setMode('login')}
                    onKeyDown={(e) => e.key === 'Enter' && setMode('login')}
                  >
                    Entrar
                  </a>
                </p>
              </>
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
