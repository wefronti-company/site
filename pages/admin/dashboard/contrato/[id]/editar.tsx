import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import type { Cliente } from '../../../../../lib/clientDb';
import type { Servico } from '../../../../../lib/servicosDb';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import ButtonPainel from '../../../../../components/ui/ButtonPainel';
import { Search, ArrowLeft } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

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
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};
const searchWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px ${spacing[3]}px`,
  minHeight: 44,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};
const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  fontSize: fontSizes.base,
  color: colors.text.light,
  outline: 'none',
};
const dropdownInlineStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: spacing[2],
  padding: spacing[3],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  maxHeight: 280,
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 9999,
};
const selectedWrapStyle: React.CSSProperties = {
  marginTop: spacing[2],
  padding: spacing[3],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  fontSize: fontSizes.sm,
  color: colors.text.light,
};
const resultItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  width: '100%',
  padding: `${spacing[3]}px ${spacing[4]}`,
  textAlign: 'left',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: fontSizes.sm,
  color: colors.text.light,
  borderRadius: 6,
  marginBottom: spacing[1],
  boxSizing: 'border-box',
};
const resultLabelStyle: React.CSSProperties = { fontWeight: 600, display: 'block', marginBottom: 2, fontSize: fontSizes.base };
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

const OPCOES_MANUTENCAO = [
  { value: '', label: 'Sem manutenção' },
  { value: 'sim', label: 'Tem manutenção' },
] as const;

const FORMAS_PAGAMENTO = [
  { value: '', label: 'Selecione' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão' },
  { value: '50_50', label: '50% entrada / 50% na entrega' },
] as const;

const PARCELAS_OPCOES = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}x` }));

function formatPreco(val: number | undefined): string {
  if (val == null || Number.isNaN(val)) return '';
  return val.toFixed(2).replace('.', ',');
}

export default function ContratoEditarPage() {
  const router = useRouter();
  const { id } = router.query;
  const { showSuccess, showError } = useSnackbar();

  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [servicosList, setServicosList] = useState<Servico[]>([]);
  const [buscaServico, setBuscaServico] = useState('');
  const [servicoDropdownAberto, setServicoDropdownAberto] = useState(false);
  const servicoSearchRef = React.useRef<HTMLDivElement>(null);

  const [servicoTipo, setServicoTipo] = useState('');
  const [precoServico, setPrecoServico] = useState('');
  const [temManutencao, setTemManutencao] = useState('');
  const [precoManutencao, setPrecoManutencao] = useState('');
  const [formaPagamentoProjeto, setFormaPagamentoProjeto] = useState('');
  const [parcelasCartao, setParcelasCartao] = useState('');

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
        setServicoTipo(c.servicoTipo ?? '');
        setPrecoServico(formatPreco(c.precoServico));
        setTemManutencao(c.manutencao ? 'sim' : '');
        setPrecoManutencao(formatPreco(c.precoManutencao ?? c.mensalidade));
        setFormaPagamentoProjeto(c.formaPagamentoProjeto ?? '');
        setParcelasCartao(c.parcelasCartao != null ? String(c.parcelasCartao) : '');
      })
      .catch(() => showError('Erro ao carregar cliente.'))
      .finally(() => setLoadingData(false));
  }, [id, showError]);

  useEffect(() => {
    fetch('/api/servicos')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setServicosList(Array.isArray(data) ? data : []))
      .catch(() => setServicosList([]));
  }, []);

  const handleClickForaServico = useCallback((e: MouseEvent) => {
    if (servicoSearchRef.current && !servicoSearchRef.current.contains(e.target as Node)) {
      setServicoDropdownAberto(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickForaServico);
    return () => document.removeEventListener('mousedown', handleClickForaServico);
  }, [handleClickForaServico]);

  const servicosFiltrados = buscaServico.trim()
    ? servicosList.filter((s) => s.nome.toLowerCase().includes(buscaServico.trim().toLowerCase()))
    : servicosList;

  const selecionarServico = (s: Servico) => {
    setServicoTipo(s.nome);
    setBuscaServico('');
    setServicoDropdownAberto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof id !== 'string' || !cliente) return;
    const precoS = precoServico ? parseFloat(precoServico.replace(',', '.')) : undefined;
    const precoM = temManutencao === 'sim' && precoManutencao ? parseFloat(precoManutencao.replace(',', '.')) : undefined;
    const parcelas = formaPagamentoProjeto === 'cartao' && parcelasCartao ? parseInt(parcelasCartao, 10) : undefined;

    setLoading(true);
    try {
      const body = {
        nome: cliente.nome,
        email: cliente.email,
        razaoSocial: cliente.razaoSocial,
        nomeFantasia: cliente.nomeFantasia ?? undefined,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
        celular: cliente.celular,
        cargo: cliente.cargo,
        cnpj: cliente.cnpj,
        ie: cliente.ie,
        enderecoLogradouro: cliente.enderecoLogradouro,
        enderecoNumero: cliente.enderecoNumero,
        enderecoComplemento: cliente.enderecoComplemento,
        enderecoBairro: cliente.enderecoBairro,
        enderecoCidade: cliente.enderecoCidade,
        enderecoUf: cliente.enderecoUf,
        enderecoCep: cliente.enderecoCep,
        telefoneEmpresa: cliente.telefoneEmpresa,
        site: cliente.site,
        ramo: cliente.ramo,
        observacoes: cliente.observacoes,
        servicoTipo: servicoTipo.trim() || undefined,
        manutencao: temManutencao === 'sim',
        precoServico: precoS,
        precoManutencao: precoM,
        formaPagamentoProjeto: formaPagamentoProjeto && formaPagamentoProjeto !== '' ? formaPagamentoProjeto : undefined,
        parcelasCartao: parcelas && parcelas >= 1 && parcelas <= 12 ? parcelas : undefined,
      };
      const res = await fetch(`/api/clientes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao atualizar contrato.');
        return;
      }
      showSuccess('Contrato atualizado com sucesso.');
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
          <title>Editar contrato | Wefronti</title>
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
          <title>Editar contrato | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <p style={{ color: colors.neutral.gray }}>Cliente não encontrado.</p>
          <Link href="/admin/dashboard/contrato/todos" style={linkVoltarStyle}>
            <ArrowLeft size={18} /> Voltar aos contratos
          </Link>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Editar contrato | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Editar contrato</h1>

        <section style={sectionStyle}>
          <div style={selectedWrapStyle}>
            Cliente: <strong>{cliente.nomeFantasia || cliente.razaoSocial}</strong> — {cliente.nome} · {cliente.email}
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <section style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Serviço e informação da conta</h2>
            <div style={formGridStyle}>
              <div style={{ ...fieldStyle, position: 'relative' }}>
                <label style={labelStyle}>Tipo de serviço</label>
                <div style={{ ...searchWrapStyle, maxWidth: '100%', position: 'relative' as const }} ref={servicoSearchRef}>
                  <Search size={20} style={{ flexShrink: 0, color: colors.text.light, opacity: 0.6 }} aria-hidden />
                  <input
                    type="search"
                    placeholder="Buscar serviço..."
                    aria-label="Buscar tipo de serviço"
                    value={servicoDropdownAberto ? buscaServico : servicoTipo}
                    onChange={(e) => {
                      setBuscaServico(e.target.value);
                      setServicoDropdownAberto(true);
                      if (!servicoDropdownAberto) setServicoTipo('');
                    }}
                    onFocus={() => {
                      setBuscaServico(servicoTipo);
                      setServicoDropdownAberto(true);
                    }}
                    style={searchInputStyle}
                  />
                  {servicoDropdownAberto && (
                    <div style={dropdownInlineStyle} role="listbox">
                      {servicosFiltrados.length === 0 ? (
                        <div style={{ padding: spacing[4], color: colors.text.light, opacity: 0.8 }}>
                          Nenhum serviço encontrado.
                        </div>
                      ) : (
                        servicosFiltrados.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            style={resultItemStyle}
                            onClick={() => selecionarServico(s)}
                          >
                            <span style={resultLabelStyle}>{s.nome}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Preço do serviço (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  style={inputStyle}
                  value={precoServico}
                  onChange={(e) => setPrecoServico(e.target.value)}
                  placeholder="0,00"
                  disabled={loading}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tem manutenção?</label>
                <select
                  style={inputStyle}
                  value={temManutencao}
                  onChange={(e) => setTemManutencao(e.target.value === 'sim' ? 'sim' : '')}
                  disabled={loading}
                >
                  {OPCOES_MANUTENCAO.map((opt) => (
                    <option key={opt.value || 'vazio'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Preço da manutenção (R$)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  style={{
                    ...inputStyle,
                    opacity: temManutencao !== 'sim' ? 0.6 : 1,
                    cursor: temManutencao !== 'sim' ? 'not-allowed' : undefined,
                  }}
                  value={precoManutencao}
                  onChange={(e) => setPrecoManutencao(e.target.value)}
                  placeholder="0,00"
                  disabled={temManutencao !== 'sim' || loading}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Forma de pagamento do projeto</label>
                <select
                  style={inputStyle}
                  value={formaPagamentoProjeto}
                  onChange={(e) => setFormaPagamentoProjeto(e.target.value)}
                  disabled={loading}
                >
                  {FORMAS_PAGAMENTO.map((opt) => (
                    <option key={opt.value || 'vazio'} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {formaPagamentoProjeto === 'cartao' && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Em quantas vezes parcelado?</label>
                  <select
                    style={inputStyle}
                    value={parcelasCartao}
                    onChange={(e) => setParcelasCartao(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Selecione</option>
                    {PARCELAS_OPCOES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </section>

          <ButtonPainel type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Atualizar contrato'}
          </ButtonPainel>
        </form>

        <Link href="/admin/dashboard/contrato/todos" style={linkVoltarStyle}>
          <ArrowLeft size={18} /> Voltar aos contratos
        </Link>
      </AdminLayout>
    </>
  );
}
