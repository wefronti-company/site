import React from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import ButtonCta from '../components/ui/ButtonCta';
import { theme } from '../styles/theme';

const { colors, spacing, fontSizes } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[8],
  backgroundColor: colors.background.dark,
  backgroundImage: "url('/images/brand/background.png')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
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
  color: colors.text.light,
  opacity: 0.85,
  margin: 0,
  letterSpacing: '0.02em',
};

const titleStyle: React.CSSProperties = {
  fontSize: fontSizes['4xl'],
  fontWeight: 400,
  lineHeight: 1.2,
  color: colors.text.light,
  margin: 0,
};

const textStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  lineHeight: 1.5,
  color: colors.text.light,
  opacity: 0.9,
  margin: 0,
};

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <SEO title="404 | Página não encontrada" description="A página que você procura não existe." noindex />

      <main style={pageStyle}>
        <div style={contentStyle}>
          <span style={codeStyle} aria-hidden>404</span>
          <h1 style={titleStyle}>Página não encontrada</h1>
          <p style={textStyle}>
            A página que você procura não existe ou foi movida. Volte ao início para continuar navegando.
          </p>
          <ButtonCta onClick={() => router.push('/')}>Voltar ao início</ButtonCta>
        </div>
      </main>
    </>
  );
};

export default NotFound;
