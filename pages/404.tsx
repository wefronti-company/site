import React from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import { theme } from '../styles/theme';

const { colors, spacing, fontSizes } = theme;

const NotFound: React.FC = () => {
  const router = useRouter();

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
  };

  const bgImageStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url(/images/brand/background-metodo.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to bottom, ${colors.background.general} 0%, ${colors.background.general} 18%, transparent 38%, transparent 62%, ${colors.background.general} 82%, ${colors.background.general} 100%)`,
    zIndex: 1,
  };

  const pageStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 560,
    gap: spacing[6],
  };

  const codeStyle: React.CSSProperties = {
    fontSize: fontSizes['5xl'],
    fontWeight: 300,
    color: colors.text.primary,
    opacity: 0.85,
    margin: 0,
    letterSpacing: '0.02em',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: fontSizes['4xl'],
    fontWeight: 400,
    lineHeight: 1.2,
    color: colors.text.primary,
    margin: 0,
  };

  const textStyle: React.CSSProperties = {
    fontSize: fontSizes.lg,
    lineHeight: 1.5,
    color: colors.text.primary,
    opacity: 0.9,
    margin: 0,
  };

  return (
    <>
      <SEO title="404 | Página não encontrada" description="A página que você procura não existe." noindex />

      <div style={wrapperStyle}>
        <div style={bgImageStyle} aria-hidden />
        <div style={gradientOverlayStyle} aria-hidden />
        <main style={pageStyle}>
        <div style={contentStyle}>
          <span style={codeStyle} aria-hidden>404</span>
          <h1 style={titleStyle}>Página não encontrada</h1>
          <p style={textStyle}>
            A página que você procura não existe ou foi removida. Volte ao início para continuar navegando.
          </p>
          <ButtonCta onClick={() => router.push('/')}>Voltar ao início</ButtonCta>
        </div>
      </main>
      </div>
    </>
  );
};

(NotFound as React.FC & { is404?: boolean }).is404 = true;
export default NotFound;
