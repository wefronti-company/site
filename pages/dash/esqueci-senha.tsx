import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { theme } from '../../styles/theme';
import { colors } from '../../styles/colors';
import ButtonPainel from '../../components/ui/ButtonPainel';
import { useSnackbar } from '../../contexts/SnackbarContext';

const { spacing, fontSizes, radii } = theme;

type Step = 1 | 2 | 3;

export default function EsqueciSenhaPage() {
  const { showSuccess, showError } = useSnackbar();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnviarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const eTrim = email.trim().toLowerCase();
    if (!eTrim) {
      showError('Informe seu e-mail.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cliente/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: eTrim }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Erro ao enviar. Tente novamente.');
        return;
      }
      showSuccess('Se o e-mail existir, você receberá o código.');
      setStep(2);
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    const codigoNum = codigo.replace(/\D/g, '').slice(0, 6);
    if (codigoNum.length !== 6) {
      showError('Digite o código de 6 dígitos.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cliente/validar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), codigo: codigoNum }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Código inválido ou expirado.');
        return;
      }
      showSuccess('Código válido! Defina sua nova senha.');
      setStep(3);
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 6) {
      showError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      showError('As senhas não conferem.');
      return;
    }
    const codigoNum = codigo.replace(/\D/g, '').slice(0, 6);
    setLoading(true);
    try {
      const res = await fetch('/api/cliente/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          codigo: codigoNum,
          senha,
        }),
        credentials: 'same-origin',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Erro ao redefinir senha.');
        return;
      }
      showSuccess('Senha alterada! Faça login.');
      window.location.href = '/';
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

  const toggleBtnStyle: React.CSSProperties = {
    position: 'absolute',
    right: spacing[2],
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: spacing[1],
    color: colors.neutral.gray,
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

  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);
  const codigoDigits = codigo.padEnd(6, ' ').slice(0, 6).split('');
  const setCodigoDigit = (index: number, val: string) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const arr = codigo.split('');
    arr[index] = d;
    setCodigo(arr.join('').slice(0, 6));
    if (d && index < 5) digitRefs.current[index + 1]?.focus();
    else if (!d && index > 0) digitRefs.current[index - 1]?.focus();
  };
  const handleCodigoPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setCodigo(pasted);
      const next = Math.min(pasted.length, 5);
      digitRefs.current[next]?.focus();
    }
  };

  const digitBoxStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: 52,
    padding: 0,
    fontSize: 22,
    fontWeight: 600,
    textAlign: 'center' as const,
    color: colors.text.light,
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    backdropFilter: 'saturate(150%) blur(12px)',
    WebkitBackdropFilter: 'saturate(150%) blur(12px)',
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: radii.full,
    outline: 'none',
  };

  return (
    <>
      <Head>
        <title>Esqueci senha | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={containerStyle} className="dash-login-page">
        <div style={leftPanelStyle} className="dash-login-left">
          <div style={leftPanelContentStyle}>
            <h2 style={leftTitleStyle}>
              Recupere seu acesso
            </h2>
            <p style={leftSubtitleStyle}>
              Em poucos passos você volta a acessar sua área do cliente.
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

            {step === 1 && (
              <>
                <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[2] }}>
                  Esqueceu sua senha?
                </h1>
                <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, marginBottom: spacing[6] }}>
                  Informe seu e-mail e enviaremos um código de 6 dígitos.
                </p>
                <form onSubmit={handleEnviarEmail} style={formStyle}>
                  <div>
                    <label style={labelStyle} htmlFor="esqueci-email">E-mail</label>
                    <input
                      id="esqueci-email"
                      type="email"
                      autoComplete="email"
                      style={inputStyle}
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                      placeholder="seu@email.com"
                      maxLength={254}
                      disabled={loading}
                    />
                  </div>
                  <ButtonPainel type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar código'}
                  </ButtonPainel>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[2] }}>
                  Digite o código
                </h1>
                <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, marginBottom: spacing[6] }}>
                  Enviamos um código de 6 dígitos para <strong>{email}</strong>
                </p>
                <form onSubmit={handleValidarCodigo} style={formStyle}>
                  <div style={{ width: '100%' }}>
                    <div
                      style={{ display: 'flex', gap: spacing[2], width: '100%' }}
                      onPaste={handleCodigoPaste}
                    >
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          ref={(el) => { digitRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          style={digitBoxStyle}
                          value={codigoDigits[i] === ' ' ? '' : codigoDigits[i]}
                          onChange={(e) => setCodigoDigit(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !codigoDigits[i] && i > 0) {
                              const arr = codigo.split('');
                              arr[i - 1] = '';
                              setCodigo(arr.join('').slice(0, 6));
                              digitRefs.current[i - 1]?.focus();
                            }
                          }}
                          disabled={loading}
                          aria-label={`Dígito ${i + 1}`}
                          className="dash-codigo-digit"
                        />
                      ))}
                    </div>
                  </div>
                  <ButtonPainel type="submit" disabled={loading}>
                    {loading ? 'Validando...' : 'Continuar'}
                  </ButtonPainel>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <h1 style={{ fontSize: fontSizes.xl, fontWeight: 400, color: colors.text.light, marginBottom: spacing[2] }}>
                  Nova senha
                </h1>
                <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, marginBottom: spacing[6] }}>
                  Defina uma nova senha para sua conta.
                </p>
                <form onSubmit={handleRedefinirSenha} style={formStyle}>
                  <div style={{ position: 'relative' }}>
                    <label style={labelStyle} htmlFor="nova-senha">Nova senha</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="nova-senha"
                        type={showSenha ? 'text' : 'password'}
                        autoComplete="new-password"
                        style={inputWithIconStyle}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                        style={toggleBtnStyle}
                        onClick={() => setShowSenha((v) => !v)}
                      >
                        {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <label style={labelStyle} htmlFor="confirmar-senha">Confirmar senha</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        id="confirmar-senha"
                        type={showConfirmar ? 'text' : 'password'}
                        autoComplete="new-password"
                        style={inputWithIconStyle}
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        placeholder="Repita a senha"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        aria-label={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                        style={toggleBtnStyle}
                        onClick={() => setShowConfirmar((v) => !v)}
                      >
                        {showConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <ButtonPainel type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Redefinir senha'}
                  </ButtonPainel>
                </form>
              </>
            )}

            <p style={{ marginTop: spacing[6], textAlign: 'center', fontSize: fontSizes.sm, color: colors.text.light }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  color: colors.blue.primary,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={16} />
                Voltar ao login
              </Link>
            </p>
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
        }
        .dash-codigo-digit {
          -webkit-appearance: none;
          appearance: none;
        }
      `}</style>
    </>
  );
}
