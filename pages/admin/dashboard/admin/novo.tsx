import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  maxWidth: 480,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
};

const labelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};

const NovoAdminPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [codigoAcesso, setCodigoAcesso] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrim = email.trim();
    const codigoTrim = codigoAcesso.trim();
    if (!emailTrim || !codigoTrim) {
      showError('Preencha e-mail e código de acesso.');
      return;
    }
    if (codigoTrim.length < 4) {
      showError('O código de acesso deve ter no mínimo 4 caracteres.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim() || undefined,
          email: emailTrim,
          codigoAcesso: codigoTrim,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao criar administrador.');
        return;
      }
      showSuccess('Administrador adicionado com sucesso.');
      setNome('');
      setEmail('');
      setCodigoAcesso('');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Adicionar admin | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Adicionar admin</h1>
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome</label>
            <input
              type="text"
              style={inputStyle}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do administrador"
              maxLength={150}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-mail *</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Código de acesso (senha) *</label>
            <input
              type="password"
              style={inputStyle}
              value={codigoAcesso}
              onChange={(e) => setCodigoAcesso(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              required
              minLength={4}
              autoComplete="new-password"
            />
          </div>
          <ButtonPainel type="submit" disabled={saving}>
            {saving ? 'Criando...' : 'Adicionar administrador'}
          </ButtonPainel>
        </form>
      </AdminLayout>
    </>
  );
};

export default NovoAdminPage;
