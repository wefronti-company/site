import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import ButtonPainel from '@/components/ui/ButtonPainel';
import { theme } from '@/styles/theme';
import { useSnackbar } from '@/contexts/SnackbarContext';

const { colors, spacing, fontSizes, radii } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const formWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: spacing[8],
  width: '100%',
  alignItems: 'start',
};

const formColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  minWidth: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.base,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[2],
  marginTop: spacing[2],
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing[4],
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  marginBottom: spacing[1],
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
  borderRadius: radii.md,
  outline: 'none',
};

const hintStyle: React.CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.neutral.gray,
  marginTop: spacing[1],
  marginBottom: 0,
};

const formGridMobile = `@media (max-width: 768px) {
  .participante-form-grid { grid-template-columns: 1fr !important; }
  .participante-form-row { grid-template-columns: 1fr !important; }
}`;

export default function EditarParticipantePage() {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useSnackbar();

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [enderecoLogradouro, setEnderecoLogradouro] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoUf, setEnderecoUf] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [banco, setBanco] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [codigoReferencia, setCodigoReferencia] = useState('');

  useEffect(() => {
    if (typeof id !== 'string') return;
    fetch(`/api/admin/indicacao/participantes/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error || 'Participante não encontrado.');
          return;
        }
        setNomeCompleto(data.nomeCompleto ?? '');
        setEmail(data.email ?? '');
        setCelular(data.celular ?? '');
        setDataNascimento(data.dataNascimento ?? '');
        setCpf(data.cpf ?? '');
        setEnderecoLogradouro(data.enderecoLogradouro ?? '');
        setEnderecoNumero(data.enderecoNumero ?? '');
        setEnderecoComplemento(data.enderecoComplemento ?? '');
        setEnderecoBairro(data.enderecoBairro ?? '');
        setEnderecoCidade(data.enderecoCidade ?? '');
        setEnderecoUf(data.enderecoUf ?? '');
        setEnderecoCep(data.enderecoCep ?? '');
        setChavePix(data.chavePix ?? '');
        setBanco(data.banco ?? '');
        setNomeTitular(data.nomeTitular ?? '');
        setCodigoReferencia((data.codigoReferencia ?? '').toLowerCase());
      })
      .catch(() => showError('Erro ao carregar participante.'))
      .finally(() => setLoadingData(false));
  }, [id, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id !== 'string') return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/indicacao/participantes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nomeCompleto: nomeCompleto.trim() || undefined,
          celular: celular.trim() || undefined,
          dataNascimento: dataNascimento.trim() || undefined,
          cpf: cpf.replace(/\D/g, '').slice(0, 14) || undefined,
          enderecoLogradouro: enderecoLogradouro.trim() || undefined,
          enderecoNumero: enderecoNumero.trim() || undefined,
          enderecoComplemento: enderecoComplemento.trim() || undefined,
          enderecoBairro: enderecoBairro.trim() || undefined,
          enderecoCidade: enderecoCidade.trim() || undefined,
          enderecoUf: enderecoUf.trim().toUpperCase().slice(0, 2) || undefined,
          enderecoCep: enderecoCep.replace(/\D/g, '').slice(0, 10) || undefined,
          chavePix: chavePix.trim() || undefined,
          banco: banco.trim() || undefined,
          nomeTitular: nomeTitular.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao salvar.');
        return;
      }
      showSuccess('Dados atualizados com sucesso.');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <>
        <Head>
          <title>Editar participante | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <div
            style={{
              height: 220,
              borderRadius: 12,
              backgroundColor: colors.admin.inactive,
              border: `1px solid ${colors.neutral.borderDark}`,
              opacity: 0.5,
            }}
          />
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Editar participante | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Editar participante</h1>
        {codigoReferencia && (
          <p style={{ margin: 0, marginBottom: spacing[6], fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.7 }}>
            Código de indicação: <code>{codigoReferencia}</code>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <style>{formGridMobile}</style>
          <div className="participante-form-grid" style={formWrapStyle}>
            <div style={formColumnStyle}>
              <h3 style={sectionTitleStyle}>Dados pessoais</h3>
              <div>
                <label style={labelStyle} htmlFor="part-nome">Nome completo</label>
                <input
                  id="part-nome"
                  type="text"
                  style={inputStyle}
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  maxLength={200}
                  disabled={saving}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-email">E-mail</label>
                <input
                  id="part-email"
                  type="email"
                  style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
                  value={email}
                  readOnly
                  disabled
                />
                <p style={hintStyle}>O e-mail não pode ser alterado.</p>
              </div>
              <div className="participante-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="part-celular">Celular</label>
                  <input
                    id="part-celular"
                    type="tel"
                    style={inputStyle}
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    maxLength={20}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="part-data">Data de nascimento</label>
                  <input
                    id="part-data"
                    type="date"
                    style={inputStyle}
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-cpf">CPF</label>
                <input
                  id="part-cpf"
                  type="text"
                  style={inputStyle}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                  maxLength={14}
                  disabled={saving}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-pix">Chave PIX</label>
                <input
                  id="part-pix"
                  type="text"
                  style={inputStyle}
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  maxLength={255}
                  disabled={saving}
                />
                <p style={hintStyle}>Para recebimento das comissões.</p>
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-banco">Banco</label>
                <input
                  id="part-banco"
                  type="text"
                  style={inputStyle}
                  value={banco}
                  onChange={(e) => setBanco(e.target.value)}
                  placeholder="Ex: Nubank, Itaú"
                  maxLength={100}
                  disabled={saving}
                />
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-titular">Nome do titular da conta</label>
                <input
                  id="part-titular"
                  type="text"
                  style={inputStyle}
                  value={nomeTitular}
                  onChange={(e) => setNomeTitular(e.target.value)}
                  placeholder="Como consta no banco"
                  maxLength={200}
                  disabled={saving}
                />
                <p style={hintStyle}>Evita erro no pagamento das comissões.</p>
              </div>
            </div>

            <div style={formColumnStyle}>
              <h3 style={sectionTitleStyle}>Endereço</h3>
              <div className="participante-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="part-cep">CEP</label>
                  <input
                    id="part-cep"
                    type="text"
                    style={inputStyle}
                    value={enderecoCep}
                    onChange={(e) => setEnderecoCep(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="part-uf">UF</label>
                  <input
                    id="part-uf"
                    type="text"
                    style={inputStyle}
                    value={enderecoUf}
                    onChange={(e) => setEnderecoUf(e.target.value.toUpperCase().slice(0, 2))}
                    maxLength={2}
                    disabled={saving}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="part-logradouro">Logradouro</label>
                <input
                  id="part-logradouro"
                  type="text"
                  style={inputStyle}
                  value={enderecoLogradouro}
                  onChange={(e) => setEnderecoLogradouro(e.target.value)}
                  maxLength={150}
                  disabled={saving}
                />
              </div>
              <div className="participante-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="part-numero">Número</label>
                  <input
                    id="part-numero"
                    type="text"
                    style={inputStyle}
                    value={enderecoNumero}
                    onChange={(e) => setEnderecoNumero(e.target.value)}
                    maxLength={20}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="part-complemento">Complemento</label>
                  <input
                    id="part-complemento"
                    type="text"
                    style={inputStyle}
                    value={enderecoComplemento}
                    onChange={(e) => setEnderecoComplemento(e.target.value)}
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="participante-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="part-bairro">Bairro</label>
                  <input
                    id="part-bairro"
                    type="text"
                    style={inputStyle}
                    value={enderecoBairro}
                    onChange={(e) => setEnderecoBairro(e.target.value)}
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="part-cidade">Cidade</label>
                  <input
                    id="part-cidade"
                    type="text"
                    style={inputStyle}
                    value={enderecoCidade}
                    onChange={(e) => setEnderecoCidade(e.target.value)}
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: spacing[8] }}>
            <ButtonPainel type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Atualizar'}
            </ButtonPainel>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
