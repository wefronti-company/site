import React from 'react';
import Head from 'next/head';
import { theme } from '../../styles/theme';

const { colors, spacing, fontSizes } = theme;

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.admin.background,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[8],
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  textAlign: 'center',
};

/** Página de login – placeholder até implementar autenticação */
const AdminLoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Login | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main style={pageStyle}>
        <h1 style={titleStyle}>Login</h1>
        <p style={subtitleStyle}>
          Área restrita. Autenticação em desenvolvimento.
        </p>
      </main>
    </>
  );
};

export default AdminLoginPage;
