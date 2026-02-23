import React, { useCallback } from 'react';
import { theme } from '../../styles/theme';
import ButtonPainel from '../ui/ButtonPainel';
import type { Cliente } from '../../lib/clientDb';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { formatTelefone, formatCelular, formatCnpj, formatCep, formatCpf } from '../../lib/formatMask';

const { colors, spacing, fontSizes } = theme;

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
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const TIPOS_SERVICO = [
  { value: '', label: 'Selecione' },
  { value: 'Site', label: 'Site' },
  { value: 'Landing Page', label: 'Landing Page' },
] as const;

const OPCOES_MANUTENCAO = [
  { value: '', label: 'Sem manutenção' },
  { value: 'sim', label: 'Manutenção' },
] as const;

export interface ClienteFormValues {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  celular: string;
  cargo: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  ie: string;
  ramo: string;
  servicoTipo: string;
  manutencao: string;
  precoServico: string;
  precoManutencao: string;
  telefoneEmpresa: string;
  site: string;
  enderecoLogradouro: string;
  enderecoNumero: string;
  enderecoComplemento: string;
  enderecoBairro: string;
  enderecoCidade: string;
  enderecoUf: string;
  enderecoCep: string;
  observacoes: string;
}

export function clienteToFormValues(c: Partial<Cliente> | null): ClienteFormValues {
  if (!c) {
    return {
      nome: '', email: '', cpf: '', telefone: '', celular: '', cargo: '',
      razaoSocial: '', nomeFantasia: '', cnpj: '', ie: '', ramo: '',
      servicoTipo: '', manutencao: '', precoServico: '', precoManutencao: '',
      telefoneEmpresa: '', site: '',
      enderecoLogradouro: '', enderecoNumero: '', enderecoComplemento: '',
      enderecoBairro: '', enderecoCidade: '', enderecoUf: '', enderecoCep: '',
      observacoes: '',
    };
  }
  const formatCnpj = (v?: string) => {
    if (!v) return '';
    const d = v.replace(/\D/g, '');
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
  };
  const formatCep = (v?: string) => {
    if (!v) return '';
    const d = v.replace(/\D/g, '');
    return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5, 8)}`;
  };
  const formatCpfDisplay = (v?: string) => {
    if (!v) return '';
    const d = v.replace(/\D/g, '');
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
  };
  const formatPhoneDisplay = (v?: string) => {
    if (!v) return '';
    const d = v.replace(/\D/g, '');
    if (d.length <= 2) return d ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  };
  return {
    nome: c.nome ?? '',
    email: c.email ?? '',
    cpf: formatCpfDisplay(c.cpf),
    telefone: formatPhoneDisplay(c.telefone),
    celular: formatPhoneDisplay(c.celular),
    cargo: c.cargo ?? '',
    razaoSocial: c.razaoSocial ?? '',
    nomeFantasia: c.nomeFantasia ?? '',
    cnpj: formatCnpj(c.cnpj),
    ie: c.ie ?? '',
    ramo: c.ramo ?? '',
    servicoTipo: c.servicoTipo ?? '',
    manutencao: c.manutencao ? 'sim' : '',
    precoServico: (c.precoServico != null && c.precoServico > 0)
      ? String(c.precoServico).replace('.', ',')
      : (c.mensalidade != null && c.mensalidade > 0 ? String(c.mensalidade).replace('.', ',') : ''),
    precoManutencao: c.precoManutencao != null && c.precoManutencao > 0 ? String(c.precoManutencao).replace('.', ',') : '',
    telefoneEmpresa: formatPhoneDisplay(c.telefoneEmpresa),
    site: c.site ?? '',
    enderecoLogradouro: c.enderecoLogradouro ?? '',
    enderecoNumero: c.enderecoNumero ?? '',
    enderecoComplemento: c.enderecoComplemento ?? '',
    enderecoBairro: c.enderecoBairro ?? '',
    enderecoCidade: c.enderecoCidade ?? '',
    enderecoUf: c.enderecoUf ?? '',
    enderecoCep: formatCep(c.enderecoCep),
    observacoes: c.observacoes ?? '',
  };
}

interface ClienteFormProps {
  values: ClienteFormValues;
  onChange: (values: ClienteFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitLabel: string;
}

export function ClienteForm({ values, onChange, onSubmit, loading, submitLabel }: ClienteFormProps) {
  const { showError } = useSnackbar();

  const set = (key: keyof ClienteFormValues, value: string) => {
    onChange({ ...values, [key]: value });
  };

  const setFormatted = (key: keyof ClienteFormValues, value: string, formatter: (v: string) => string) => {
    set(key, formatter(value));
  };

  const buscarCep = useCallback(async () => {
    const cepDigits = values.enderecoCep.replace(/\D/g, '');
    if (cepDigits.length !== 8) return;
    try {
      const res = await fetch(`/api/cep/${cepDigits}`);
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'CEP não encontrado.');
        return;
      }
      onChange({
        ...values,
        enderecoLogradouro: data.logradouro ?? values.enderecoLogradouro,
        enderecoBairro: data.bairro ?? values.enderecoBairro,
        enderecoCidade: data.localidade ?? values.enderecoCidade,
        enderecoUf: data.uf ?? values.enderecoUf,
      });
    } catch {
      showError('Erro ao buscar CEP. Tente novamente.');
    }
  }, [values, onChange, showError]);

  return (
    <form className="cliente-form" onSubmit={onSubmit}>
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Dados do contato</h2>
        <div style={formGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome completo *</label>
            <input
              type="text"
              style={inputStyle}
              value={values.nome}
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Nome do contato"
              required
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>E-mail *</label>
            <input
              type="email"
              style={inputStyle}
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="email@empresa.com"
              required
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>CPF</label>
            <input
              type="text"
              style={inputStyle}
              value={values.cpf}
              onChange={(e) => setFormatted('cpf', e.target.value, formatCpf)}
              placeholder="000.000.000-00"
              maxLength={14}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone</label>
            <input
              type="tel"
              style={inputStyle}
              value={values.telefone}
              onChange={(e) => setFormatted('telefone', e.target.value, formatTelefone)}
              placeholder="(11) 3333-4444"
              maxLength={15}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Celular</label>
            <input
              type="tel"
              style={inputStyle}
              value={values.celular}
              onChange={(e) => setFormatted('celular', e.target.value, formatCelular)}
              placeholder="(11) 99999-8888"
              maxLength={16}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cargo / Função</label>
            <input
              type="text"
              style={inputStyle}
              value={values.cargo}
              onChange={(e) => set('cargo', e.target.value)}
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
              value={values.razaoSocial}
              onChange={(e) => set('razaoSocial', e.target.value)}
              placeholder="Nome legal da empresa"
              required
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome fantasia</label>
            <input
              type="text"
              style={inputStyle}
              value={values.nomeFantasia}
              onChange={(e) => set('nomeFantasia', e.target.value)}
              placeholder="Nome comercial"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>CNPJ</label>
            <input
              type="text"
              style={inputStyle}
              value={values.cnpj}
              onChange={(e) => setFormatted('cnpj', e.target.value, formatCnpj)}
              placeholder="00.000.000/0001-00"
              maxLength={18}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Inscrição estadual</label>
            <input
              type="text"
              style={inputStyle}
              value={values.ie}
              onChange={(e) => set('ie', e.target.value)}
              placeholder="IE (se houver)"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Ramo de atividade</label>
            <input
              type="text"
              style={inputStyle}
              value={values.ramo}
              onChange={(e) => set('ramo', e.target.value)}
              placeholder="Ex: Tecnologia, Comércio"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Telefone da empresa</label>
            <input
              type="tel"
              style={inputStyle}
              value={values.telefoneEmpresa}
              onChange={(e) => setFormatted('telefoneEmpresa', e.target.value, formatTelefone)}
              placeholder="(11) 3333-0000"
              maxLength={16}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Site</label>
            <input
              type="url"
              style={inputStyle}
              value={values.site}
              onChange={(e) => set('site', e.target.value)}
              placeholder="https://"
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Serviço</h2>
        <div style={formGridStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Tipo de serviço</label>
            <select
              style={inputStyle}
              value={values.servicoTipo}
              onChange={(e) => set('servicoTipo', e.target.value)}
            >
              {TIPOS_SERVICO.map((opt) => (
                <option key={opt.value || 'vazio'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Manutenção</label>
            <select
              style={inputStyle}
              value={values.manutencao}
              onChange={(e) => set('manutencao', e.target.value === 'sim' ? 'sim' : '')}
            >
              {OPCOES_MANUTENCAO.map((opt) => (
                <option key={opt.value || 'vazio'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Preço do serviço (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              style={inputStyle}
              value={values.precoServico}
              onChange={(e) => set('precoServico', e.target.value)}
              placeholder="0,00"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Preço da manutenção (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              style={{
                ...inputStyle,
                opacity: values.manutencao !== 'sim' ? 0.6 : 1,
                cursor: values.manutencao !== 'sim' ? 'not-allowed' : undefined,
              }}
              value={values.precoManutencao}
              onChange={(e) => set('precoManutencao', e.target.value)}
              placeholder="0,00"
              disabled={values.manutencao !== 'sim'}
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
              value={values.enderecoCep}
              onChange={(e) => setFormatted('enderecoCep', e.target.value, formatCep)}
              onBlur={buscarCep}
              placeholder="00000-000"
              maxLength={9}
            />
          </div>
          <div style={{ ...fieldStyle, gridColumn: '2 / -1' }}>
            <label style={labelStyle}>Logradouro</label>
            <input
              type="text"
              style={inputStyle}
              value={values.enderecoLogradouro}
              onChange={(e) => set('enderecoLogradouro', e.target.value)}
              placeholder="Rua, Avenida, etc."
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Número</label>
            <input
              type="text"
              style={inputStyle}
              value={values.enderecoNumero}
              onChange={(e) => set('enderecoNumero', e.target.value)}
              placeholder="Nº"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Complemento</label>
            <input
              type="text"
              style={inputStyle}
              value={values.enderecoComplemento}
              onChange={(e) => set('enderecoComplemento', e.target.value)}
              placeholder="Sala, Bloco"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Bairro</label>
            <input
              type="text"
              style={inputStyle}
              value={values.enderecoBairro}
              onChange={(e) => set('enderecoBairro', e.target.value)}
              placeholder="Bairro"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Cidade</label>
            <input
              type="text"
              style={inputStyle}
              value={values.enderecoCidade}
              onChange={(e) => set('enderecoCidade', e.target.value)}
              placeholder="Cidade"
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>UF</label>
            <select
              style={inputStyle}
              value={values.enderecoUf}
              onChange={(e) => set('enderecoUf', e.target.value)}
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
        <h2 style={sectionTitleStyle}>Observações</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Notas internas</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
            value={values.observacoes}
            onChange={(e) => set('observacoes', e.target.value)}
            placeholder="Informações adicionais sobre o cliente"
            rows={4}
          />
        </div>
      </section>

      <ButtonPainel type="submit" disabled={loading}>
        {loading ? 'Salvando...' : submitLabel}
      </ButtonPainel>

      <style jsx global>{`
        .cliente-form input:focus,
        .cliente-form select:focus,
        .cliente-form textarea:focus {
          outline: none;
          box-shadow: none;
        }
      `}</style>
    </form>
  );
}
