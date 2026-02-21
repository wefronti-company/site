import React from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';

const { colors, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: 16,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
};

const ClientesDesligadosPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Clientes desligados | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Clientes desligados</h1>
        <p style={subtitleStyle}>
          Listagem de clientes que cancelaram os serviços. Em desenvolvimento.
        </p>
      </AdminLayout>
    </>
  );
};

export default ClientesDesligadosPage;
