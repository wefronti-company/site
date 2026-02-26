import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import ButtonPainel from '../../../../../components/ui/ButtonPainel';
import { formatCpf, formatCelular, formatCep, formatCnpj } from '../../../../../lib/formatMask';
import type { Cliente } from '../../../../../lib/clientDb';
import { ArrowLeft } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
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
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[4],
};
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: spacing[1] };
const labelStyle: React.CSSProperties = { fontSize: fontSizes.sm, fontWeight: 500, color: colors.text.light };
const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[5]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  outline: 'none',
};
const hintStyle: React.CSSProperties = { fontSize: fontSizes.xs, color: colors.neutral.gray, marginTop: spacing[1], marginBottom: 0 };
const linkVoltarStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  color: colors.blue.primary,
  textDecoration: 'none',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  marginTop: spacing[8],
};

export default function EditarClientePage() {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useSnackbar();

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);

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
  const [mensalidade, setMensalidade] = useState('');
  const [diaVencimento, setDiaVencimento] = useState('');

  useEffect(() => {
    if (typeof id !== 'string') return;
    setLoadingData(true);
    fetch(`/api/clientes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error || 'Cliente não encontrado.');
          return;
        }
        const c = data as Cliente;
        setCliente(c);
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
        setMensalidade(c.mensalidade != null && c.mensalidade > 0 ? c.mensalidade.toFixed(2).replace('.', ',') : '');
        setDiaVencimento(c.mensalidade != null && c.mensalidade > 0 && c.diaVencimento != null ? String(c.diaVencimento) : '');
      })
      .catch(() => showError('Erro ao carregar cliente.'))
      .finally(() => setLoadingData(false));
  }, [id, showError]);

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
    if (typeof id !== 'string' || !cliente) return;
    if (!nome.trim() || !cliente.email?.trim() || !razaoSocial.trim()) {
      showError('Preencha nome, e-mail e razão social.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: cliente.email.trim().toLowerCase(),
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
          mensalidade: mensalidade ? parseFloat(mensalidade.replace(',', '.')) : 0,
          diaVencimento: diaVencimento ? Math.min(31, Math.max(1, parseInt(diaVencimento, 10))) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao atualizar cliente.');
        return;
      }
      showSuccess('Cliente atualizado com sucesso.');
      setCliente(data as Cliente);
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Head>
          <title>Editar cliente | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <div style={{ height: 220, borderRadius: 12, backgroundColor: colors.admin.inactive, border: `1px solid ${colors.neutral.borderDark}`, opacity: 0.5 }} />
        </AdminLayout>
      </>
    );
  }

  if (!cliente) {
    return (
      <>
        <Head>
          <title>Editar cliente | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.neutral.gray }}>Cliente não encontrado.</p>
         
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Editar cliente | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Editar cliente</h1>
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
                  disabled={loading}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>E-mail</label>
                <input
                  type="email"
                  style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
                  value={cliente.email ?? ''}
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

          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Manutenção</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: spacing[4] }}>
              <div style={{ ...fieldStyle, flex: '1 1 180px', maxWidth: 240 }}>
                <label style={labelStyle}>Preço da mensalidade (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  style={inputStyle}
                  value={mensalidade}
                  onChange={(e) => setMensalidade(e.target.value)}
                  placeholder="0,00"
                  disabled={loading}
                />
              </div>
              <div style={{ ...fieldStyle, flex: '0 1 120px', maxWidth: 140 }}>
                <label style={labelStyle}>Dia de vencimento</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  style={inputStyle}
                  value={diaVencimento}
                  onChange={(e) => setDiaVencimento(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  placeholder="Ex: 10"
                  disabled={loading}
                />
              </div>
              <div style={{ flex: '0 0 auto', marginBottom: 0 }}>
                <button
                  type="button"
                  onClick={() => {
                    setMensalidade('');
                    setDiaVencimento('');
                    showSuccess('Mensalidade e vencimento resetados. Clique em Atualizar para salvar.');
                  }}
                  disabled={loading}
                  style={{
                    minHeight: 44,
                    padding: `0 ${spacing[4]}`,
                    fontSize: fontSizes.sm,
                    fontWeight: 500,
                    color: colors.blue.primary,
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.blue.primary}`,
                    borderRadius: 6,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    boxSizing: 'border-box',
                  }}
                >
                  Resetar
                </button>
              </div>
            </div>
          </section>

          <ButtonPainel type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Atualizar'}
          </ButtonPainel>
        </form>

      
      </AdminLayout>
    </>
  );
}
