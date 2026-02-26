import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { theme } from '../styles/theme';
import { useSnackbar } from '../contexts/SnackbarContext';
import { formatCpf, formatCelular, formatCep, formatCnpj } from '../lib/formatMask';

const { colors, spacing, fontSizes } = theme;

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes['2xl'],
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
};

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  color: colors.text.light,
  opacity: 0.8,
  margin: 0,
  marginBottom: spacing[8],
};

const wrapStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: spacing[6],
  paddingTop: spacing[12],
  paddingBottom: spacing[12],
};

const sectionStyle: React.CSSProperties = { marginBottom: spacing[8] };
const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};
const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: spacing[4],
};
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: spacing[1] };
const labelStyle: React.CSSProperties = { fontSize: fontSizes.sm, fontWeight: 500, color: colors.text.light };
const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  fontSize: fontSizes.base,
  minHeight: 48,
  color: colors.text.light,
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  outline: 'none',
};
const btnStyle: React.CSSProperties = {
  padding: `${spacing[3]}px ${spacing[8]}`,
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.text.light,
  backgroundColor: colors.blue.primary,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

export default function CadastroPage() {
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
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
    if (!nome.trim() || !email.trim() || !razaoSocial.trim()) {
      showError('Preencha nome, e-mail e razão social.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          cpf: cpf.replace(/\D/g, '') || undefined,
          celular: celular.replace(/\D/g, '') || undefined,
          razaoSocial: razaoSocial.trim(),
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
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao cadastrar.');
        return;
      }
      showSuccess('Cadastro realizado com sucesso. Em breve entraremos em contato.');
      setNome('');
      setEmail('');
      setCpf('');
      setCelular('');
      setRazaoSocial('');
      setCnpj('');
      setSite('');
      setEnderecoCep('');
      setEnderecoLogradouro('');
      setEnderecoNumero('');
      setEnderecoComplemento('');
      setEnderecoBairro('');
      setEnderecoCidade('');
      setEnderecoUf('');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={wrapStyle}>
        <h1 style={pageTitleStyle}>Cadastro</h1>
        <p style={pageSubtitleStyle}>
          Preencha seus dados para que possamos entrar em contato.
        </p>

        <form onSubmit={handleSubmit}>
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Dados do contato</h2>
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
                  disabled={loading}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>E-mail *</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@empresa.com"
                  required
                  maxLength={254}
                  disabled={loading}
                />
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Dados da empresa</h2>
            <div style={formGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nome da empresa *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Razão social ou nome fantasia"
                  required
                  maxLength={200}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Endereço</h2>
            <div style={formGridStyle}>
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>UF</label>
                <select
                  style={inputStyle}
                  value={enderecoUf}
                  onChange={(e) => setEnderecoUf(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar cadastro'}
          </button>
        </form>
      </div>
    </>
  );
}
