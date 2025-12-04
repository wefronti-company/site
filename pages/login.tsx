import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import Logo from '../components/ui/Logo';
import { Boxes } from '../components/ui/shadcn-io/background-boxes';
import { colors } from '../styles/colors';

const Login: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!token || token.trim().length < 10) {
      setError('Por favor, insira um token válido (mínimo 10 caracteres)');
      setIsSubmitting(false);
      return;
    }

    // Simulação de validação - adaptar para sua lógica real
    try {
      // Aqui você faria a validação do token com sua API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se token for válido, redireciona para o painel
      // router.push('/dashboard');
      
      // Por enquanto, apenas mostra erro para demonstração
      setError('Token inválido. Solicite acesso ao time.');
      setIsSubmitting(false);
    } catch (err) {
      setError('Erro ao validar token. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Acesso ao Painel" 
        description="Acesse o painel de gerenciamento com seu token de acesso" 
        noindex 
      />

      <div className="h-screen flex flex-col lg:flex-row relative overflow-hidden" style={{ backgroundColor: colors.blackColor }}>
        
        {/* Background Boxes Global */}
        <div className="absolute inset-0 w-full h-full z-[5] opacity-40 pointer-events-none">
          <Boxes />
        </div>

        {/* Overlay escuro global */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-[10]" />
        
        {/* Lado Esquerdo - Título Estratégico */}
        <div className="relative flex-1 flex items-center justify-center p-8 lg:p-16 overflow-hidden h-[40vh] lg:h-screen z-[20]">
          {/* Conteúdo */}
          <div className="relative max-w-2xl text-center lg:text-left">
            <div style={{ marginBottom: '70px' }} className="flex justify-center lg:justify-start">
              <div className="scale-[1.2] lg:scale-[1.5]" style={{ transformOrigin: 'center left' }}>
                <Logo />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-500 leading-tight bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2">
              Bem-vindo de volta!
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
              Acesse seu painel de gerenciamento com segurança. Insira seu token de acesso exclusivo para continuar.
            </p>

            {/* Indicador visual */}
            <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/5 border border-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: colors.gradientOne }} />
                      <stop offset="100%" style={{ stopColor: colors.gradientTwo }} />
                    </linearGradient>
                  </defs>
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="url(#lockGradient)" strokeWidth="2" fill="none"/>
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="url(#lockGradient)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                <span className="text-xs md:text-sm font-regular text-white whitespace-nowrap">
                  Acesso seguro
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário de Login */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-16 relative z-[20]">
          {/* Card de Login */}
          <div className="w-full max-w-md p-8 lg:p-12 rounded-[20px] backdrop-blur-xl" style={{ border: `1px solid ${colors.borderDark}`, backgroundColor: 'rgba(16, 16, 16, 0.6)' }}>
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <h2 className="font-500 bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent pb-2" style={{ fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: '1.2' }}>
                Acesse o painel
              </h2>
              <p className="mt-3 text-white/70" style={{ fontSize: 'clamp(16px, 2vw, 18px)' }}>
                Utilize seu token de acesso para entrar
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Input de Token */}
              <div>
                <label 
                  htmlFor="token" 
                  className="block text-sm font-medium mb-2 text-white/90"
                >
                  Token de acesso <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Insira seu token exclusivo"
                    required
                    minLength={10}
                    className={`w-full px-4 py-3 rounded-[10px] transition-all duration-300 outline-none ${
                      error ? 'border-2 border-red-500' : ''
                    }`}
                    style={{
                      backgroundColor: colors.colorGray,
                      border: error ? '2px solid #EF4444' : `1px solid ${colors.borderDark}`,
                      color: colors.whiteColor,
                      fontSize: '16px'
                    }}
                  />
                  {error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                {error && (
                  <div 
                    className="mt-2 flex items-start gap-2 p-3 rounded-[10px]"
                    style={{
                      backgroundColor: 'rgba(254, 226, 226, 1)',
                      border: `1px solid rgba(239, 68, 68, 0.3)`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm text-red-600 font-medium">
                      {error}
                    </p>
                  </div>
                )}
                {!error && (
                  <p className="mt-2 text-xs text-white/50">
                    Não possui um token? Entre em contato com nossa equipe.
                  </p>
                )}
              </div>

              {/* Botão de Entrar */}
              <div className="pt-2">
                <ButtonCta 
                  label={isSubmitting ? 'Validando...' : 'Entrar no painel'} 
                  type="submit"
                  disabled={isSubmitting}
                />
              </div>

              {/* Link de volta */}
              <div className="text-left pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-white/60 hover:text-white/90 transition-colors underline"
                  style={{ fontSize: '15px' }}
                >
                  Voltar para o site
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
