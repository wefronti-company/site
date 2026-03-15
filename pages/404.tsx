import React from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import Logo from '../components/ui/Logo';
import { theme } from '../styles/theme';

const { colors, spacing, fontSizes } = theme;

const NotFound: React.FC = () => {
  const router = useRouter();

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    backgroundImage: 'url(/images/brand/background.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
      <SEO title="Página não encontrada" description="A página que você procura não existe." noindex />

      <div style={wrapperStyle}>
        <main style={pageStyle}>
          <div style={contentStyle}>
            <Logo style={{ marginBottom: spacing[2] }} />
            <h1 style={titleStyle}>Página não encontrada</h1>
            <p style={textStyle}>
              A página que você procura não existe ou foi removida. Volte ao início para continuar navegando.
            </p>
            <div style={{ width: 'fit-content' }}>
              <ButtonCta onClick={() => router.push('/')} fullWidthOnMobile={false}>
                Voltar ao início
              </ButtonCta>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

(NotFound as React.FC & { is404?: boolean }).is404 = true;
export default NotFound;
