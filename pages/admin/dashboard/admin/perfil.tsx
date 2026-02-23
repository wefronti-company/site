import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const subtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  color: colors.text.light,
  opacity: 0.7,
  margin: 0,
  marginBottom: spacing[6],
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
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

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[3],
};

const PerfilAdminPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setNome(data.nome ?? '');
          setEmail(data.email ?? '');
        }
      })
      .catch(() => showError('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, [showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      showError('As senhas não conferem.');
      return;
    }
    if (novaSenha && novaSenha.length < 4) {
      showError('A senha deve ter no mínimo 4 caracteres.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim() || undefined,
          codigoAcesso: novaSenha.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao atualizar.');
        return;
      }
      showSuccess('Perfil atualizado com sucesso.');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Perfil | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.text.light, opacity: 0.7 }}>Carregando...</p>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Perfil | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Perfil</h1>
        <p style={subtitleStyle}>Seus dados de administrador.</p>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div>
            <h2 style={sectionTitleStyle}>Dados pessoais</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nome</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  maxLength={150}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>E-mail</label>
                <input
                  type="email"
                  style={{ ...inputStyle, opacity: 0.8, cursor: 'not-allowed' }}
                  value={email}
                  readOnly
                  disabled
                  aria-readonly
                />
                <span style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.6 }}>
                  O e-mail não pode ser alterado.
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 style={sectionTitleStyle}>Alterar senha</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nova senha</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Deixe em branco para manter a atual"
                  autoComplete="new-password"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Confirmar nova senha</label>
                <input
                  type="password"
                  style={inputStyle}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <ButtonPainel type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </ButtonPainel>
        </form>
      </AdminLayout>
    </>
  );
};

export default PerfilAdminPage;
