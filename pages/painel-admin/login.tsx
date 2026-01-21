import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { colors } from '../../styles/colors';
import { isValidEmail } from '../../utils/security-frontend';
import Logo from '../../components/ui/Logo';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!email || !isValidEmail(email)) {
      errors.email = 'Por favor, insira um e-mail válido';
    }
    if (!password) {
      errors.password = 'Por favor, insira sua senha';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const first = Object.keys(errors)[0];
      document.querySelector(`[name="${first}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Erro ao autenticar');
        setIsSubmitting(false);
        return;
      }
      router.push('/painel-admin');
    } catch (err) {
      setError('Erro de rede');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background.dark }}>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-10 -mt-6">
          <Logo isDark={false} />
        </div>
        <div className="p-8 bg-white rounded shadow">
          <style dangerouslySetInnerHTML={{ __html: `
            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active,
            textarea:-webkit-autofill,
            textarea:-webkit-autofill:hover,
            textarea:-webkit-autofill:focus,
            textarea:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
              -webkit-text-fill-color: #000000 !important;
              box-shadow: 0 0 0 30px #ffffff inset !important;
              transition: background-color 5000s ease-in-out 0s;
            }

            input:focus,
            textarea:focus {
              border-color: ${colors.neutral.borderDark} !important;
              outline: none;
            }
          ` }} />
          <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              autoComplete="email"
              autoFocus
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => { setEmail(e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' })); }}
              className="w-full px-4 py-3 text-sm transition-colors"
              style={{ backgroundColor: '#ffffff', border: `1px solid ${fieldErrors.email ? '#ef4444' : '#e5e7eb'}`, color: '#000000', borderRadius: '4px' }}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-regular mb-2" style={{ color: '#000000' }}>Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              autoComplete="current-password"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' })); }}
              className="w-full px-4 py-3 text-sm transition-colors"
              style={{ backgroundColor: '#ffffff', border: `1px solid ${fieldErrors.password ? '#ef4444' : '#e5e7eb'}`, color: '#000000', borderRadius: '4px' }}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs" style={{ color: '#ef4444' }}>{fieldErrors.password}</p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #ef4444' }}>
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-3 font-medium text-base transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: colors.neutral.gray, color: colors.text.light, borderRadius: '4px' }}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>        </div>      </div>
    </div>
  );
};

export default LoginPage;
