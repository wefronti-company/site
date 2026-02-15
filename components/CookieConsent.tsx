import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { colors } from '../styles/colors';
import { loadGoogleAnalytics } from '../lib/gtag';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre true, não pode ser desabilitado
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar se já existe consentimento salvo
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      // Aguardar 1 segundo antes de mostrar o banner
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Carregar preferências salvas
      const saved = JSON.parse(savedConsent);
      setPreferences(saved);
      loadCookieScripts(saved);
    }
  }, []);

  // Quando o banner está visível, adiciona padding-bottom no body para evitar que o banner sobreponha links no footer
  useEffect(() => {
    let prevPadding = '';
    if (showBanner) {
      prevPadding = document.body.style.paddingBottom || '';
      // calcula altura do banner
      const el = document.querySelector('.cookie-banner-inner') as HTMLElement | null;
      const h = el ? `${el.offsetHeight}px` : '96px';
      document.body.style.paddingBottom = h;
    }
    return () => {
      // restaurar padding anterior
      document.body.style.paddingBottom = prevPadding;
    };
  }, [showBanner]);

  const loadCookieScripts = (prefs: CookiePreferences) => {
    // Analytics (Google Analytics)
    if (prefs.analytics) {
      loadGoogleAnalytics();
    }

    // Marketing (Facebook Pixel, LinkedIn Insight, etc.)
    if (prefs.marketing) {
      // Adicione aqui outros scripts de marketing quando necessário
      // Exemplo: loadFacebookPixel();
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    loadCookieScripts(prefs);
    setShowBanner(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Não permite desabilitar cookies necessários
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner Principal */}
      {!showSettings && (
        <div
          className="cookie-banner fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up"
          style={{
            backgroundColor: colors.background.dark,
            borderTop: `1px solid ${colors.neutral.borderDark}`,
            // allow clicks to pass through the banner except on interactive controls
            pointerEvents: 'none'
          }}
        >
          <div style={{ pointerEvents: 'auto' }} className="cookie-banner-inner max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Texto */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie size={20} style={{ color: colors.icons.light }} />
                  <h3 className="text-lg font-medium" style={{ color: colors.text.light }}>
                    Este site utiliza cookies
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.text.light, opacity: 0.8 }}>
                  Usamos cookies essenciais para o funcionamento do site e, com seu consentimento, cookies de análise e marketing para melhorar sua experiência. 
                  Você pode gerenciar suas preferências a qualquer momento.{' '}
                  <a 
                    href="/politica-privacidade" 
                    target="_blank"
                    className="underline"
                    style={{ color: colors.text.dark }}
                  >
                    Saiba mais
                  </a>
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.background.dark,
                    color: colors.text.light,
                    border: `1px solid ${colors.neutral.borderDark}`,
                    borderRadius: '6px',
                  }}
                >
                  <Settings size={16} />
                  Preferências
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    backgroundColor: colors.background.dark,
                    color: colors.text.light,
                    border: `1px solid ${colors.neutral.borderDark}`,
                    borderRadius: '6px',
                  }}
                >
                  Rejeitar
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: colors.blue.primary,
                    color: colors.text.light,
                    border: `1px solid ${colors.neutral.borderDark}`,
                    borderRadius: '6px',
                  }}
                >
                  Ok, entendi!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configurações */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scale-in"
            style={{
              backgroundColor: colors.background.dark,
              border: `1px solid ${colors.neutral.borderDark}`,
              borderRadius: '6px',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-medium mb-2" style={{ color: colors.text.light }}>
                  Configurações de Cookies
                </h2>
                <p className="text-sm" style={{ color: colors.text.light, opacity: 0.8 }}>
                  Gerencie suas preferências de cookies. Você pode alterar essas configurações a qualquer momento.
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: colors.background.dark }}
              >
                <X size={20} style={{ color: colors.text.light }} />
              </button>
            </div>

            {/* Categorias de Cookies */}
            <div className="space-y-6 mb-6">
              
              {/* Cookies Necessários */}
              <div
                className="p-4 rounded-lg"
                style={{
                
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: '6px',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-regular mb-1" style={{ color: colors.text.light }}>
                      Cookies Necessários
                    </h3>
                    <p className="text-sm font-regular" style={{ color: colors.text.dark, opacity: 0.8 }}>
                      Essenciais para o funcionamento do site. Não podem ser desabilitados.
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-regular"
                    style={{
                      backgroundColor: colors.blue.primary,
                      color: colors.text.light, borderRadius: '3px',
                    }}
                  >
                    Sempre ativo
                  </div>
                </div>
                
              </div>

              {/* Cookies de Análise */}
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: colors.background.dark,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: '6px',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1" style={{ color: colors.text.light }}>
                      Cookies de Análise
                    </h3>
                    <p className="text-sm" style={{ color: colors.text.dark, opacity: 0.8 }}>
                      Coletam dados sobre como você usa o site para melhorar a experiência.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className="relative w-12 h-6 rounded-full transition-all"
                    style={{
                      backgroundColor: preferences.analytics ? colors.blue.primary : colors.neutral.borderDark,
                    }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{
                        left: preferences.analytics ? '26px' : '4px',
                      }}
                    />
                  </button>
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: colors.background.dark,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: '6px',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-regular mb-1" style={{ color: colors.text.light }}>
                      Cookies de Marketing
                    </h3>
                    <p className="text-sm font-regular" style={{ color: colors.text.dark, opacity: 0.8 }}>
                      Utilizados para exibir anúncios personalizados e medir campanhas.
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className="relative w-12 h-6 rounded-full transition-all"
                    style={{
                      backgroundColor: preferences.marketing ? colors.blue.primary : colors.neutral.borderDark,
                    }}
                  >
                    <div
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{
                        left: preferences.marketing ? '26px' : '4px',
                      }}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRejectAll}
                className="flex-1 px-6 py-3 text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: colors.background.dark,
                  color: colors.text.light,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: '6px',
                }}
              >
                Rejeitar Todos
              </button>
              
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: colors.blue.primary,
                  color: colors.text.light,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: '6px',
                }}
              >
                Salvar Preferências
              </button>
            </div>

            {/* Link para Política */}
            <p className="text-center text-xs mt-4" style={{ color: colors.text.light, opacity: 0.6 }}>
              Para mais informações, consulte nossa{' '}
              <a 
                href="/politica-privacidade" 
                target="_blank"
                className="underline"
                style={{ color: colors.text.light }}
              >
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CookieConsent;
