import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashLayout from '../../../components/dash/DashLayout';
import ButtonPainel from '../../../components/ui/ButtonPainel';
import { theme } from '../../../styles/theme';
import { colors } from '../../../styles/colors';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';
import { formatCpf, formatCelular, formatCep, formatCnpj } from '../../../lib/formatMask';

const { spacing, fontSizes, radii } = theme;

const sectionStyle: React.CSSProperties = {
  marginBottom: spacing[8],
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[4],
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
  padding: `${spacing[3]}px ${spacing[5]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: 'rgba(18, 18, 18, 0.4)',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  outline: 'none',
};

const hintStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.neutral.gray,
  marginTop: spacing[1],
  marginBottom: 0,
};

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

interface ClienteMeusDados {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  celular: string;
  razaoSocial: string;
  cnpj: string;
  site: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUf: string;
  enderecoCep: string;
}

export default function DashPerfilPage() {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const { usuario, loading: userLoading } = useDashUsuario();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<ClienteMeusDados | null>(null);
  const [modalDeletarOpen, setModalDeletarOpen] = useState(false);
  const [deletingConta, setDeletingConta] = useState(false);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [site, setSite] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');
  const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoUf, setEnderecoUf] = useState('');

  const loadDados = useCallback(() => {
    if (!usuario?.id) return;
    setLoading(true);
    fetch('/api/cliente/meus-dados', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { cliente: null }))
      .then((data) => {
        const c = data.cliente as ClienteMeusDados | null;
        setCliente(c);
        if (c) {
          setNome(c.nome ?? '');
          setCpf(c.cpf ?? '');
          setCelular(c.celular ?? '');
          setRazaoSocial(c.razaoSocial ?? '');
          setCnpj(c.cnpj ?? '');
          setSite(c.site ?? '');
          setEnderecoCep(c.enderecoCep ?? '');
          setEnderecoLogradouro(c.enderecoLogradouro ?? '');
          setEnderecoNumero(c.enderecoNumero ?? '');
          setEnderecoComplemento(c.enderecoComplemento ?? '');
          setEnderecoBairro(c.enderecoBairro ?? '');
          setEnderecoCidade(c.enderecoCidade ?? '');
          setEnderecoUf(c.enderecoUf ?? '');
        } else {
          setNome(usuario.nomeCompleto ?? '');
          setCpf(usuario.cpf ?? '');
          setCelular(usuario.celular ?? '');
          setEnderecoLogradouro(usuario.enderecoLogradouro ?? '');
          setEnderecoNumero(usuario.enderecoNumero ?? '');
          setEnderecoComplemento(usuario.enderecoComplemento ?? '');
          setEnderecoBairro(usuario.enderecoBairro ?? '');
          setEnderecoCidade(usuario.enderecoCidade ?? '');
          setEnderecoUf(usuario.enderecoUf ?? '');
          setEnderecoCep(usuario.enderecoCep ?? '');
        }
      })
      .catch(() => setCliente(null))
      .finally(() => setLoading(false));
  }, [usuario?.id, usuario?.nomeCompleto, usuario?.cpf, usuario?.celular, usuario?.enderecoLogradouro, usuario?.enderecoNumero, usuario?.enderecoComplemento, usuario?.enderecoBairro, usuario?.enderecoCidade, usuario?.enderecoUf, usuario?.enderecoCep]);

  useEffect(() => {
    loadDados();
  }, [loadDados]);

  const buscarCep = useCallback(() => {
    const cepDigits = enderecoCep.replace(/\D/g, '');
    if (cepDigits.length !== 8) return;
    fetch(`/api/cep/${cepDigits}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setEnderecoLogradouro((v) => data.logradouro ?? v);
          setEnderecoBairro((v) => data.bairro ?? v);
          setEnderecoCidade((v) => data.localidade ?? v);
          setEnderecoUf(data.uf ?? '');
        }
      })
      .catch(() => {});
  }, [enderecoCep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/cliente/meus-dados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome: nome.trim() || undefined,
          cpf: cpf.replace(/\D/g, '') || undefined,
          celular: celular.replace(/\D/g, '') || undefined,
          razaoSocial: razaoSocial.trim() || undefined,
          cnpj: cnpj.replace(/\D/g, '').slice(0, 14) || undefined,
          site: site.trim() || undefined,
          enderecoLogradouro: enderecoLogradouro.trim() || undefined,
          enderecoNumero: enderecoNumero.trim() || undefined,
          enderecoComplemento: enderecoComplemento.trim() || undefined,
          enderecoBairro: enderecoBairro.trim() || undefined,
          enderecoCidade: enderecoCidade.trim() || undefined,
          enderecoUf: enderecoUf.trim() || undefined,
          enderecoCep: enderecoCep.replace(/\D/g, '') || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showError(data.error || 'Erro ao salvar. Tente novamente.');
        return;
      }
      showSuccess('Dados atualizados com sucesso.');
      loadDados();
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletarContaConfirm = async () => {
    setDeletingConta(true);
    try {
      const res = await fetch('/api/cliente/deletar-conta', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showError(data.error || 'Não foi possível excluir a conta. Tente novamente.');
        return;
      }
      showSuccess('Sua conta foi excluída.');
      setModalDeletarOpen(false);
      router.push('/dash');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setDeletingConta(false);
    }
  };

  if (!usuario) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Meus dados | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <DashLayout>
        <section style={{ width: '100%' }}>
          {userLoading || loading ? (
            <p style={{ color: colors.neutral.gray }}>Carregando...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Dados do contato</h3>
                <div style={formGridStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Nome completo *</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Nome do contato"
                      required
                      maxLength={150}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>E-mail</label>
                    <input
                      type="email"
                      style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
                      value={usuario.email}
                      readOnly
                      disabled
                    />
                    <p style={hintStyle}>O e-mail não pode ser alterado.</p>
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>CPF</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={cpf}
                      onChange={(e) => setCpf(formatCpf(e.target.value))}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Celular</label>
                    <input
                      type="tel"
                      style={inputStyle}
                      value={celular}
                      onChange={(e) => setCelular(formatCelular(e.target.value))}
                      placeholder="(11) 99999-8888"
                      maxLength={16}
                      disabled={saving}
                    />
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Dados da empresa</h3>
                <div style={{ ...formGridStyle, gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Nome da empresa *</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      placeholder="Nome da empresa"
                      required
                      maxLength={200}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>CNPJ</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Site</label>
                    <input
                      type="url"
                      style={inputStyle}
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      placeholder="https://exemplo.com.br"
                      maxLength={200}
                      disabled={saving}
                    />
                  </div>
                </div>
              </section>

              <section style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Endereço</h3>
                <div style={{ ...formGridStyle, gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>CEP</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoCep}
                      onChange={(e) => setEnderecoCep(formatCep(e.target.value))}
                      onBlur={buscarCep}
                      placeholder="00000-000"
                      maxLength={9}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Logradouro</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoLogradouro}
                      onChange={(e) => setEnderecoLogradouro(e.target.value)}
                      placeholder="Rua, Avenida, etc."
                      maxLength={150}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Número</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoNumero}
                      onChange={(e) => setEnderecoNumero(e.target.value)}
                      placeholder="Nº"
                      maxLength={20}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Complemento</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoComplemento}
                      onChange={(e) => setEnderecoComplemento(e.target.value)}
                      placeholder="Sala, Bloco"
                      maxLength={80}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Bairro</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoBairro}
                      onChange={(e) => setEnderecoBairro(e.target.value)}
                      placeholder="Bairro"
                      maxLength={80}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Cidade</label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={enderecoCidade}
                      onChange={(e) => setEnderecoCidade(e.target.value)}
                      placeholder="Cidade"
                      maxLength={80}
                      disabled={saving}
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>UF</label>
                    <select
                      style={inputStyle}
                      value={enderecoUf}
                      onChange={(e) => setEnderecoUf(e.target.value)}
                      disabled={saving}
                    >
                      <option value="">Selecione</option>
                      {UFS.map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <ButtonPainel type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </ButtonPainel>

              <div style={{ marginTop: spacing[10], paddingTop: spacing[8], borderTop: `1px solid ${colors.neutral.borderDark}` }}>
                <h3 style={{ ...sectionTitleStyle, color: colors.neutral.gray, marginBottom: spacing[2] }}>Área de risco</h3>
                <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, margin: 0, marginBottom: spacing[4], maxWidth: 560 }}>
                  Se você excluir sua conta, perderá o acesso à área do cliente. Esta ação é irreversível. Leia as informações no modal antes de confirmar.
                </p>
                <button
                  type="button"
                  onClick={() => setModalDeletarOpen(true)}
                  disabled={saving}
                  style={{
                    padding: `${spacing[3]}px ${spacing[5]}px`,
                    fontSize: fontSizes.sm,
                    fontWeight: 500,
                    color: 'rgba(248, 113, 113, 0.95)',
                    background: 'rgba(248, 113, 113, 0.1)',
                    border: '1px solid rgba(248, 113, 113, 0.4)',
                    borderRadius: radii.md,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Deletar conta
                </button>
              </div>
            </form>
          )}

          {modalDeletarOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-deletar-title"
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing[4],
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
              onClick={() => !deletingConta && setModalDeletarOpen(false)}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 440,
                  padding: spacing[8],
                  backgroundColor: colors.admin.background,
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: radii.md,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="modal-deletar-title" style={{ fontSize: fontSizes.xl, fontWeight: 600, color: colors.text.light, margin: 0, marginBottom: spacing[4] }}>
                  Excluir conta?
                </h2>
                <p style={{ fontSize: fontSizes.sm, color: colors.text.light, margin: 0, marginBottom: spacing[4], lineHeight: 1.5 }}>
                  Antes de continuar, leia atentamente:
                </p>
                <ul style={{ margin: 0, paddingLeft: spacing[6], fontSize: fontSizes.sm, color: colors.neutral.gray, lineHeight: 1.6, marginBottom: spacing[6] }}>
                  <li style={{ marginBottom: spacing[2] }}>
                    <strong style={{ color: colors.text.light }}>E-mail bloqueado:</strong> não será possível criar uma nova conta no futuro usando o mesmo endereço de e-mail.
                  </li>
                  <li style={{ marginBottom: spacing[2] }}>
                    <strong style={{ color: colors.text.light }}>Retenção de dados:</strong> os dados vinculados à sua conta (cadastrais e de contrato) podem ser mantidos pela Wefronti por até 5 (cinco) anos, para cumprimento de obrigações legais, fiscais e contratuais, nos termos da Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018) e das regras de negócio da empresa.
                  </li>
                  <li style={{ marginBottom: spacing[2] }}>
                    <strong style={{ color: colors.text.light }}>Irreversível:</strong> você perderá o acesso à área do cliente e não será possível desfazer esta ação.
                  </li>
                </ul>
                <div style={{ display: 'flex', gap: spacing[4], justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => !deletingConta && setModalDeletarOpen(false)}
                    disabled={deletingConta}
                    style={{
                      padding: `${spacing[3]}px ${spacing[5]}px`,
                      fontSize: fontSizes.sm,
                      fontWeight: 500,
                      color: colors.text.light,
                      background: 'transparent',
                      border: `1px solid ${colors.neutral.borderDark}`,
                      borderRadius: radii.md,
                      cursor: deletingConta ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletarContaConfirm}
                    disabled={deletingConta}
                    style={{
                      padding: `${spacing[3]}px ${spacing[5]}px`,
                      fontSize: fontSizes.sm,
                      fontWeight: 500,
                      color: '#fff',
                      background: 'rgba(248, 113, 113, 0.9)',
                      border: '1px solid rgba(248, 113, 113, 0.6)',
                      borderRadius: radii.md,
                      cursor: deletingConta ? 'not-allowed' : 'pointer',
                      opacity: deletingConta ? 0.7 : 1,
                    }}
                  >
                    {deletingConta ? 'Excluindo...' : 'Sim, excluir minha conta'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </DashLayout>
    </>
  );
}
