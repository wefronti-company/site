import React, { useState, useEffect, useRef } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { theme } from '../styles/theme';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { loadGoogleAnalytics } from '../lib/gtag';

const { colors, spacing, fontSizes, radii } = theme;

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const bannerInnerRef = useRef<HTMLDivElement>(null);
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      const saved = JSON.parse(savedConsent);
      setPreferences(saved);
      loadCookieScripts(saved);
    }
  }, []);

  // Box no canto esquerdo — não altera padding do body

  const loadCookieScripts = (prefs: CookiePreferences) => {
    if (prefs.analytics) loadGoogleAnalytics();
    if (prefs.marketing) { /* future */ }
  };

  const handleAcceptAll = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectAll = () => {
    savePreferences({ necessary: true, analytics: false, marketing: false });
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
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  const boxStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 24,
    left: 24,
    zIndex: 50,
    width: 'min(360px, calc(100vw - 48px))',
    padding: spacing[5],
    backgroundColor: 'rgba(4, 4, 4, 0.75)',
    backdropFilter: 'saturate(180%) blur(12px)',
    WebkitBackdropFilter: 'saturate(180%) blur(12px)',
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: 30,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'slide-up 0.4s ease-out',
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[4],
  };

  const buttonsRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  };

  const btnStyle: React.CSSProperties = {
    padding: `${spacing[2]}px ${spacing[4]}px`,
    fontSize: fontSizes.sm,
    fontWeight: 500,
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: 30,
    backgroundColor: colors.background.dark,
    color: colors.text.light,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  };

  const btnPrimaryStyle: React.CSSProperties = {
    ...btnStyle,
    background: colors.blue.primary,
  };

  return (
    <>
      {!showSettings && (
        <div ref={bannerInnerRef} style={boxStyle}>
          <div style={innerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2] }}>
              <Cookie size={20} style={{ color: colors.icons.light }} />
              <h3 style={{ fontSize: fontSizes.lg, fontWeight: 500, color: colors.text.light, margin: 0 }}>
                Este site utiliza cookies
              </h3>
            </div>
            <p style={{ fontSize: fontSizes.sm, lineHeight: 1.6, color: colors.text.light, opacity: 0.8, margin: 0 }}>
              Usamos cookies essenciais para o funcionamento do site e, com seu consentimento, cookies de análise e marketing para melhorar sua experiência.{' '}
            <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" style={{ color: colors.blue.primary, textDecoration: 'underline' }}>
              Saiba mais
            </a>
            </p>
            <div style={buttonsRowStyle}>
              <button onClick={() => setShowSettings(true)} style={{ ...btnStyle, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: spacing[2], width: '100%' }}>
                <Settings size={16} />
                Preferências
              </button>
              <div style={{ display: 'flex', gap: spacing[2] }}>
                <button onClick={handleRejectAll} style={{ ...btnStyle, flex: 1 }}>Rejeitar</button>
                <button onClick={handleAcceptAll} style={{ ...btnPrimaryStyle, flex: 1 }}>Ok, entendi!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
            paddingTop: 100,
            paddingBottom: 100,
            backgroundColor: 'rgba(0,0,0,0.8)',
            animation: 'fade-in 0.3s ease-out',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 672,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: spacing[6],
              backgroundColor: colors.background.dark,
              border: `1px solid ${colors.neutral.borderDark}`,
              borderRadius: 30,
              animation: 'scale-in 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[6] }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 500, color: colors.text.light, margin: 0, marginBottom: spacing[2] }}>
                  Configurações de Cookies
                </h2>
                <p style={{ fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8, margin: 0 }}>
                  Gerencie suas preferências de cookies. Você pode alterar essas configurações a qualquer momento.
                </p>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                style={{ padding: spacing[2], border: 0, borderRadius: 30, background: colors.background.dark, cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                <X size={20} style={{ color: colors.text.light }} />
              </button>
            </div>

            <div style={{ marginBottom: spacing[6] }}>
              {[
                { key: 'necessary' as const, title: 'Cookies Necessários', desc: 'Essenciais para o funcionamento do site. Não podem ser desabilitados.', always: true },
                { key: 'analytics' as const, title: 'Cookies de Análise', desc: 'Coletam dados sobre como você usa o site para melhorar a experiência.', always: false },
                { key: 'marketing' as const, title: 'Cookies de Marketing', desc: 'Utilizados para exibir anúncios personalizados e medir campanhas.', always: false },
              ].map(({ key, title, desc, always }) => (
                <div
                  key={key}
                  style={{
                    padding: spacing[4],
                    marginBottom: spacing[6],
                    border: `1px solid ${colors.neutral.borderDark}`,
                    borderRadius: 20,
                    backgroundColor: colors.background.dark,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing[2] }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: fontSizes.lg, fontWeight: 400, color: colors.text.light, margin: 0, marginBottom: 4 }}>
                        {title}
                      </h3>
                      <p style={{ fontSize: fontSizes.sm, color: colors.text.dark, opacity: 0.8, margin: 0 }}>{desc}</p>
                    </div>
                    {always ? (
                      <span style={{ padding: `${4}px ${spacing[3]}px`, fontSize: 12, fontWeight: 400, background: colors.blue.primary, color: colors.text.light, borderRadius: 30 }}>
                        Sempre ativo
                      </span>
                    ) : (
                      <button
                        onClick={() => togglePreference(key)}
                        style={{
                          position: 'relative',
                          width: 48,
                          height: 24,
                          border: 0,
                          borderRadius: radii.full,
                          cursor: 'pointer',
                          background: preferences[key] ? colors.blue.primary : colors.neutral.borderDark,
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: 4,
                            left: preferences[key] ? 26 : 4,
                            width: 16,
                            height: 16,
                            borderRadius: radii.full,
                            background: '#fff',
                            transition: 'left 0.2s',
                          }}
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              <button onClick={handleRejectAll} style={{ ...btnStyle, flex: 1, padding: `${spacing[3]}px ${spacing[6]}px` }}>
                Rejeitar Todos
              </button>
              <button onClick={handleSavePreferences} style={{ ...btnPrimaryStyle, flex: 1, padding: `${spacing[3]}px ${spacing[6]}px` }}>
                Salvar Preferências
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: 12, marginTop: spacing[4], color: colors.text.light, opacity: 0.6 }}>
              <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" style={{ color: colors.text.light, textDecoration: 'underline' }}>
                Mais informações, leia nossa política de privacidade.
              </a>
            </p>

          </div>
        </div>
      )}

    </>
  );
};

export default CookieConsent;
