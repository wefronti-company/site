import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import ButtonPainel from '../../../../components/ui/ButtonPainel';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const sectionStyle: React.CSSProperties = {
  marginBottom: spacing[8],
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
  paddingBottom: spacing[2],
  borderBottom: `1px solid ${colors.neutral.borderDark}`,
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
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const ClienteNovoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [cargo, setCargo] = useState('');

  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [ie, setIe] = useState('');
  const [ramo, setRamo] = useState('');
  const [mensalidade, setMensalidade] = useState<string>('');
  const [telefoneEmpresa, setTelefoneEmpresa] = useState('');
  const [site, setSite] = useState('');

  const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoUf, setEnderecoUf] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');

  const [observacoes, setObservacoes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nome.trim() || !email.trim() || !razaoSocial.trim()) {
      setError('Preencha nome, e-mail e razão social.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/clientes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone.trim() || undefined,
          celular: celular.trim() || undefined,
          cargo: cargo.trim() || undefined,
          razaoSocial: razaoSocial.trim(),
          nomeFantasia: nomeFantasia.trim() || undefined,
          cnpj: cnpj.replace(/\D/g, '') || undefined,
          ie: ie.trim() || undefined,
          ramo: ramo.trim() || undefined,
          mensalidade: mensalidade ? parseFloat(mensalidade.replace(',', '.')) || undefined : undefined,
          telefoneEmpresa: telefoneEmpresa.trim() || undefined,
          site: site.trim() || undefined,
          enderecoLogradouro: enderecoLogradouro.trim() || undefined,
          enderecoNumero: enderecoNumero.trim() || undefined,
          enderecoComplemento: enderecoComplemento.trim() || undefined,
          enderecoBairro: enderecoBairro.trim() || undefined,
          enderecoCidade: enderecoCidade.trim() || undefined,
          enderecoUf: enderecoUf.trim() || undefined,
          enderecoCep: enderecoCep.replace(/\D/g, '') || undefined,
          observacoes: observacoes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao cadastrar cliente.');
        return;
      }
      setSuccess(true);
      setNome('');
      setEmail('');
      setTelefone('');
      setCelular('');
      setCargo('');
      setRazaoSocial('');
      setNomeFantasia('');
      setCnpj('');
      setIe('');
      setRamo('');
      setMensalidade('');
      setTelefoneEmpresa('');
      setSite('');
      setEnderecoLogradouro('');
      setEnderecoNumero('');
      setEnderecoComplemento('');
      setEnderecoBairro('');
      setEnderecoCidade('');
      setEnderecoUf('');
      setEnderecoCep('');
      setObservacoes('');
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cadastrar cliente | Wefronti Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Cadastrar novo cliente</h1>

        <form className="cliente-novo-form" onSubmit={handleSubmit}>
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
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Telefone</label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 3333-4444"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Celular</label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="(11) 99999-8888"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Cargo / Função</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Diretor, Gerente"
                />
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Dados da empresa</h2>
            <div style={formGridStyle}>
              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Razão social *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  placeholder="Nome legal da empresa"
                  required
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nome fantasia</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  placeholder="Nome comercial"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>CNPJ</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0001-00"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Inscrição estadual</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={ie}
                  onChange={(e) => setIe(e.target.value)}
                  placeholder="IE (se houver)"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Ramo de atividade</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={ramo}
                  onChange={(e) => setRamo(e.target.value)}
                  placeholder="Ex: Tecnologia, Comércio"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Mensalidade (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  style={inputStyle}
                  value={mensalidade}
                  onChange={(e) => setMensalidade(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Telefone da empresa</label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={telefoneEmpresa}
                  onChange={(e) => setTelefoneEmpresa(e.target.value)}
                  placeholder="(11) 3333-0000"
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Site</label>
                <input
                  type="url"
                  style={inputStyle}
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  placeholder="https://"
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
                  onChange={(e) => setEnderecoCep(e.target.value)}
                  placeholder="00000-000"
                />
              </div>
              <div style={{ ...fieldStyle, gridColumn: '2 / -1' }}>
                <label style={labelStyle}>Logradouro</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={enderecoLogradouro}
                  onChange={(e) => setEnderecoLogradouro(e.target.value)}
                  placeholder="Rua, Avenida, etc."
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
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>UF</label>
                <select
                  style={inputStyle}
                  value={enderecoUf}
                  onChange={(e) => setEnderecoUf(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Observações</h2>
            <div style={fieldStyle}>
              <label style={labelStyle}>Notas internas</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais sobre o cliente"
                rows={4}
              />
            </div>
          </section>

          {error && (
            <p style={{ margin: 0, marginBottom: spacing[4], fontSize: fontSizes.sm, color: '#f87171' }}>
              {error}
            </p>
          )}

          {success && (
            <p
              style={{
                margin: 0,
                marginBottom: spacing[4],
                fontSize: fontSizes.sm,
                color: '#4ade80',
                padding: spacing[3],
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderRadius: 8,
              }}
            >
              Cliente cadastrado com sucesso.
            </p>
          )}

          <ButtonPainel type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar cliente'}
          </ButtonPainel>
        </form>

        <style jsx global>{`
          .cliente-novo-form input:focus,
          .cliente-novo-form select:focus,
          .cliente-novo-form textarea:focus {
            outline: none;
            box-shadow: none;
          }
        `}</style>
      </AdminLayout>
    </>
  );
};

export default ClienteNovoPage;
