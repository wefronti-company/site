import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashLayout from '../../../components/dash/DashLayout';
import ButtonPainel from '../../../components/ui/ButtonPainel';
import { theme } from '../../../styles/theme';
import { colors } from '../../../styles/colors';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { useDashUsuario } from '../../../contexts/DashUsuarioContext';

const { spacing, fontSizes } = theme;

const formWrapStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: spacing[8],
  width: '100%',
  alignItems: 'start',
};

const formWrapMobile = `@media (max-width: 768px) {
  .perfil-form-grid { grid-template-columns: 1fr; }
  .perfil-form-row { grid-template-columns: 1fr !important; }
}`;

const formColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
  minWidth: 0,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[4],
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
  padding: `${spacing[3]}px ${spacing[5]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: 'rgba(18, 18, 18, 0.4)',
  backdropFilter: 'saturate(150%) blur(12px)',
  WebkitBackdropFilter: 'saturate(150%) blur(12px)',
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

function onlyDigits(v: string): string {
  return v.replace(/\D/g, '');
}

function formatCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCep(v: string): string {
  const d = onlyDigits(v).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatPhoneBr(v: string): string {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function DashPerfilPage() {
  const { showSuccess, showError } = useSnackbar();
  const { usuario, loading, refetch } = useDashUsuario();
  const [saving, setSaving] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState('');
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
  const [whatsappNumero, setWhatsappNumero] = useState('');
  const [whatsappMensagem, setWhatsappMensagem] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (usuario && !isDirty) {
      setNomeCompleto(usuario.nomeCompleto ?? '');
      setCelular(formatPhoneBr(usuario.celular ?? ''));
      setDataNascimento(usuario.dataNascimento ?? '');
      setCpf(formatCpf(usuario.cpf ?? ''));
      setEnderecoLogradouro(usuario.enderecoLogradouro ?? '');
      setEnderecoNumero(usuario.enderecoNumero ?? '');
      setEnderecoComplemento(usuario.enderecoComplemento ?? '');
      setEnderecoBairro(usuario.enderecoBairro ?? '');
      setEnderecoCidade(usuario.enderecoCidade ?? '');
      setEnderecoUf(usuario.enderecoUf ?? '');
      setEnderecoCep(formatCep(usuario.enderecoCep ?? ''));
      setChavePix(usuario.chavePix ?? '');
      setBanco(usuario.banco ?? '');
      setNomeTitular(usuario.nomeTitular ?? '');
      setWhatsappNumero(formatPhoneBr(usuario.whatsappNumero ?? ''));
      setWhatsappMensagem(usuario.whatsappMensagem ?? '');
    }
  }, [usuario, isDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/usuario/atualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nomeCompleto: nomeCompleto.trim() || undefined,
          celular: onlyDigits(celular) || undefined,
          dataNascimento: dataNascimento.trim() || undefined,
          cpf: onlyDigits(cpf) || undefined,
          enderecoLogradouro: enderecoLogradouro.trim() || undefined,
          enderecoNumero: enderecoNumero.trim() || undefined,
          enderecoComplemento: enderecoComplemento.trim() || undefined,
          enderecoBairro: enderecoBairro.trim() || undefined,
          enderecoCidade: enderecoCidade.trim() || undefined,
          enderecoUf: enderecoUf.trim() || undefined,
          enderecoCep: onlyDigits(enderecoCep) || undefined,
          chavePix: chavePix.trim() || undefined,
          banco: banco.trim() || undefined,
          nomeTitular: nomeTitular.trim() || undefined,
          whatsappNumero: onlyDigits(whatsappNumero) || undefined,
          whatsappMensagem: whatsappMensagem.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showError(data.error || 'Erro ao salvar. Tente novamente.');
        return;
      }
      showSuccess('Dados atualizados com sucesso.');
      setIsDirty(false);
      refetch();
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setSaving(false);
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
          <h2 style={{ fontSize: 'clamp(1.125rem, 4vw, 1.25rem)', fontWeight: 600, color: colors.text.light, margin: 0, marginBottom: spacing[2] }}>
            Meus dados
          </h2>
          <p style={{ fontSize: fontSizes.sm, color: colors.neutral.gray, margin: 0, marginBottom: spacing[6] }}>
            Complete suas informações. O e-mail não pode ser alterado. Informe a chave PIX para receber as comissões das suas indicações.
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <style>{formWrapMobile}</style>
            <div className="perfil-form-grid" style={formWrapStyle}>
              <div style={formColumnStyle}>
              <h3 style={sectionTitleStyle}>Dados pessoais</h3>

              <div>
                <label style={labelStyle} htmlFor="perfil-nome">Nome completo</label>
                <input
                  id="perfil-nome"
                  type="text"
                  autoComplete="name"
                  style={inputStyle}
                  value={nomeCompleto}
                  onChange={(e) => {
                    setIsDirty(true);
                    setNomeCompleto(e.target.value);
                  }}
                  placeholder="Seu nome completo"
                  maxLength={200}
                  disabled={saving}
                />
              </div>

              <div>
                <label style={labelStyle} htmlFor="perfil-email">E-mail</label>
                <input
                  id="perfil-email"
                  type="email"
                  style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed' }}
                  value={usuario.email}
                  readOnly
                  disabled
                />
                <p style={hintStyle}>O e-mail não pode ser alterado.</p>
              </div>

              <div className="perfil-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="perfil-celular">Celular</label>
                  <input
                    id="perfil-celular"
                    type="tel"
                    autoComplete="tel"
                    style={inputStyle}
                    value={celular}
                    onChange={(e) => {
                      setIsDirty(true);
                      setCelular(formatPhoneBr(e.target.value));
                    }}
                    placeholder="(00) 00000-0000"
                    maxLength={20}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="perfil-data-nasc">Data de nascimento</label>
                  <input
                    id="perfil-data-nasc"
                    type="date"
                    style={inputStyle}
                    value={dataNascimento}
                    onChange={(e) => {
                      setIsDirty(true);
                      setDataNascimento(e.target.value);
                    }}
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="perfil-cpf">CPF</label>
                <input
                  id="perfil-cpf"
                  type="text"
                  style={inputStyle}
                  value={cpf}
                  onChange={(e) => {
                    setIsDirty(true);
                    setCpf(formatCpf(e.target.value));
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  disabled={saving}
                />
              </div>

              </div>

              <div style={formColumnStyle}>
              <h3 style={sectionTitleStyle}>Endereço</h3>

              <div className="perfil-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="perfil-cep">CEP</label>
                  <input
                    id="perfil-cep"
                    type="text"
                    style={inputStyle}
                    value={enderecoCep}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoCep(formatCep(e.target.value));
                    }}
                    placeholder="00000-000"
                    maxLength={10}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="perfil-uf">UF</label>
                  <input
                    id="perfil-uf"
                    type="text"
                    style={inputStyle}
                    value={enderecoUf}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoUf(e.target.value.toUpperCase().slice(0, 2));
                    }}
                    placeholder="SP"
                    maxLength={2}
                    disabled={saving}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="perfil-logradouro">Logradouro</label>
                <input
                  id="perfil-logradouro"
                  type="text"
                  autoComplete="street-address"
                  style={inputStyle}
                  value={enderecoLogradouro}
                  onChange={(e) => {
                    setIsDirty(true);
                    setEnderecoLogradouro(e.target.value);
                  }}
                  placeholder="Rua, avenida..."
                  maxLength={150}
                  disabled={saving}
                />
              </div>

              <div className="perfil-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="perfil-numero">Número</label>
                  <input
                    id="perfil-numero"
                    type="text"
                    style={inputStyle}
                    value={enderecoNumero}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoNumero(e.target.value);
                    }}
                    placeholder="123"
                    maxLength={20}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="perfil-complemento">Complemento</label>
                  <input
                    id="perfil-complemento"
                    type="text"
                    style={inputStyle}
                    value={enderecoComplemento}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoComplemento(e.target.value);
                    }}
                    placeholder="Apto, bloco..."
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="perfil-form-row" style={rowStyle}>
                <div>
                  <label style={labelStyle} htmlFor="perfil-bairro">Bairro</label>
                  <input
                    id="perfil-bairro"
                    type="text"
                    style={inputStyle}
                    value={enderecoBairro}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoBairro(e.target.value);
                    }}
                    placeholder="Bairro"
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="perfil-cidade">Cidade</label>
                  <input
                    id="perfil-cidade"
                    type="text"
                    autoComplete="address-level2"
                    style={inputStyle}
                    value={enderecoCidade}
                    onChange={(e) => {
                      setIsDirty(true);
                      setEnderecoCidade(e.target.value);
                    }}
                    placeholder="Cidade"
                    maxLength={80}
                    disabled={saving}
                  />
                </div>
              </div>

              </div>

              <h3 style={{ ...sectionTitleStyle, gridColumn: '1 / -1', marginTop: spacing[4] }}>Pagamento</h3>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle} htmlFor="perfil-chave-pix">Chave PIX</label>
                <input
                  id="perfil-chave-pix"
                  type="text"
                  style={inputStyle}
                  value={chavePix}
                  onChange={(e) => {
                    setIsDirty(true);
                    setChavePix(e.target.value);
                  }}
                  placeholder="CPF, e-mail, telefone ou chave aleatória"
                  maxLength={255}
                  disabled={saving}
                />
                <p style={hintStyle}>
                  Onde deseja receber os pagamentos das comissões das suas indicações.
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle} htmlFor="perfil-banco">Banco</label>
                <input
                  id="perfil-banco"
                  type="text"
                  style={inputStyle}
                  value={banco}
                  onChange={(e) => {
                    setIsDirty(true);
                    setBanco(e.target.value);
                  }}
                  placeholder="Ex: Nubank, Itaú, Banco do Brasil"
                  maxLength={100}
                  disabled={saving}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle} htmlFor="perfil-nome-titular">Nome do titular da conta</label>
                <input
                  id="perfil-nome-titular"
                  type="text"
                  style={inputStyle}
                  value={nomeTitular}
                  onChange={(e) => {
                    setIsDirty(true);
                    setNomeTitular(e.target.value);
                  }}
                  placeholder="Nome exatamente como está no banco"
                  maxLength={200}
                  disabled={saving}
                />
                <p style={hintStyle}>
                  Evita erro no pagamento das comissões. Informe como consta na conta PIX.
                </p>
              </div>

              <h3 style={{ ...sectionTitleStyle, gridColumn: '1 / -1', marginTop: spacing[4] }}>WhatsApp de atendimento</h3>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle} htmlFor="perfil-whatsapp-numero">Número do WhatsApp</label>
                <input
                  id="perfil-whatsapp-numero"
                  type="text"
                  style={inputStyle}
                  value={whatsappNumero}
                  onChange={(e) => {
                    setIsDirty(true);
                    setWhatsappNumero(formatPhoneBr(e.target.value));
                  }}
                  placeholder="Ex: (21) 98101-3467"
                  maxLength={20}
                  disabled={saving}
                />
                <p style={hintStyle}>
                  Este será o número que receberá os contatos do site quando usarem seu link de indicação.
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle} htmlFor="perfil-whatsapp-mensagem">Mensagem personalizada</label>
                <input
                  id="perfil-whatsapp-mensagem"
                  type="text"
                  style={inputStyle}
                  value={whatsappMensagem}
                  onChange={(e) => {
                    setIsDirty(true);
                    setWhatsappMensagem(e.target.value);
                  }}
                  placeholder="Ex: Olá! Sou parceiro Wefronti, posso te ajudar com seu site?"
                  maxLength={400}
                  disabled={saving}
                />
                <p style={hintStyle}>
                  Essa mensagem será enviada automaticamente no clique dos botões de WhatsApp do site.
                </p>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: spacing[2] }}>
                <ButtonPainel type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar alterações'}
                </ButtonPainel>
              </div>
            </div>
          </form>
        </section>
      </DashLayout>
    </>
  );
}
