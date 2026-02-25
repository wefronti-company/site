import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Cliente } from '../../../../lib/clientDb';
import type { Servico } from '../../../../lib/servicosDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { Search } from 'lucide-react';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
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

const searchWrapStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: 460,
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

const dropdownPortalStyle = (top: number, left: number, width: number): React.CSSProperties => ({
  position: 'fixed',
  top,
  left,
  width,
  padding: spacing[3],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  maxHeight: 280,
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 99999,
});

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

const resultAvatarStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(53, 152, 255, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.blue.primary,
  flexShrink: 0,
};

const resultLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  display: 'block',
  marginBottom: 2,
  fontSize: fontSizes.base,
};

const resultMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  opacity: 0.7,
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

function getInitial(nameOrEmail: string): string {
  const first = nameOrEmail.charAt(0);
  return first ? first.toUpperCase() : '?';
}

const DEBOUNCE_MS = 300;

export default function ContratoPage() {
  const { showSuccess, showError } = useSnackbar();
  const searchRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const servicoSearchRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<Cliente[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [servicosList, setServicosList] = useState<Servico[]>([]);
  const [buscaServico, setBuscaServico] = useState('');
  const [servicoDropdownAberto, setServicoDropdownAberto] = useState(false);
  const [servicoTipo, setServicoTipo] = useState('');
  const [precoServico, setPrecoServico] = useState('');
  const [temManutencao, setTemManutencao] = useState('');
  const [precoManutencao, setPrecoManutencao] = useState('');
  const [formaPagamentoProjeto, setFormaPagamentoProjeto] = useState('');
  const [parcelasCartao, setParcelasCartao] = useState('');

  useEffect(() => {
    const t = busca.trim();
    if (t.length < 1) {
      setResultados([]);
      setDropdownAberto(false);
      return;
    }
    const id = setTimeout(() => {
      setBuscando(true);
      fetch(`/api/clientes/busca?q=${encodeURIComponent(t)}`, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
          setDropdownAberto(true);
        })
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [busca]);

  const handleClickFora = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    if (searchRef.current?.contains(target) || portalRef.current?.contains(target)) return;
    setDropdownAberto(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [handleClickFora]);

  useEffect(() => {
    if (!dropdownAberto || !searchRef.current) {
      setDropdownRect(null);
      return;
    }
    const el = searchRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + spacing[2],
        left: rect.left,
        width: rect.width,
      });
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [dropdownAberto, resultados, busca]);

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

  const [selecionandoCliente, setSelecionandoCliente] = useState(false);

  const selecionarCliente = useCallback(async (c: Cliente) => {
    setSelecionandoCliente(true);
    setDropdownAberto(false);
    setBusca('');
    setResultados([]);
    try {
      const res = await fetch(`/api/clientes/${c.id}`, { credentials: 'same-origin' });
      if (!res.ok) {
        setSelectedCliente(c);
        return;
      }
      const data = await res.json();
      setSelectedCliente(data);
    } catch {
      setSelectedCliente(c);
    } finally {
      setSelecionandoCliente(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) {
      showError('Busque e selecione um cliente.');
      return;
    }
    const precoS = precoServico ? parseFloat(precoServico.replace(',', '.')) : undefined;
    const precoM = temManutencao === 'sim' && precoManutencao ? parseFloat(precoManutencao.replace(',', '.')) : undefined;
    const parcelas = formaPagamentoProjeto === 'cartao' && parcelasCartao ? parseInt(parcelasCartao, 10) : undefined;
    setLoading(true);
    try {
      const body = {
        nome: selectedCliente.nome,
        email: selectedCliente.email,
        razaoSocial: selectedCliente.razaoSocial,
        nomeFantasia: selectedCliente.nomeFantasia ?? undefined,
        cpf: selectedCliente.cpf,
        telefone: selectedCliente.telefone,
        celular: selectedCliente.celular,
        cargo: selectedCliente.cargo,
        cnpj: selectedCliente.cnpj,
        ie: selectedCliente.ie,
        enderecoLogradouro: selectedCliente.enderecoLogradouro,
        enderecoNumero: selectedCliente.enderecoNumero,
        enderecoComplemento: selectedCliente.enderecoComplemento,
        enderecoBairro: selectedCliente.enderecoBairro,
        enderecoCidade: selectedCliente.enderecoCidade,
        enderecoUf: selectedCliente.enderecoUf,
        enderecoCep: selectedCliente.enderecoCep,
        telefoneEmpresa: selectedCliente.telefoneEmpresa,
        site: selectedCliente.site,
        ramo: selectedCliente.ramo,
        observacoes: selectedCliente.observacoes,
        servicoTipo: servicoTipo.trim() || undefined,
        manutencao: temManutencao === 'sim',
        precoServico: precoS,
        precoManutencao: precoM,
        formaPagamentoProjeto: formaPagamentoProjeto && formaPagamentoProjeto !== '' ? formaPagamentoProjeto : undefined,
        parcelasCartao: parcelas && parcelas >= 1 && parcelas <= 12 ? parcelas : undefined,
      };
      const res = await fetch(`/api/clientes/${selectedCliente.id}`, {
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
      setSelectedCliente(null);
      setServicoTipo('');
      setPrecoServico('');
      setTemManutencao('');
      setPrecoManutencao('');
      setFormaPagamentoProjeto('');
      setParcelasCartao('');
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Adicionar novo | Contrato | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Adicionar novo</h1>
        <p style={{ margin: 0, marginBottom: spacing[6], fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.8 }}>
          Busque um cliente já cadastrado e adicione o serviço e as informações da conta. O valor da manutenção é o que o cliente paga mensalmente.
        </p>

        <form onSubmit={handleSubmit}>
          <section style={{ ...sectionStyle, position: 'relative', zIndex: 10 }}>
            <div style={{ ...fieldStyle, maxWidth: 460 }}>
              <label style={labelStyle}>Buscar cliente</label>
              <div style={searchWrapStyle} ref={searchRef}>
                <Search size={20} style={{ flexShrink: 0, color: colors.text.light, opacity: 0.6 }} aria-hidden />
                <input
                  type="search"
                  placeholder="Nome, empresa, e-mail, CPF ou CNPJ..."
                  aria-label="Buscar cliente"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onFocus={() => resultados.length > 0 && setDropdownAberto(true)}
                  style={searchInputStyle}
                  disabled={!!selectedCliente}
                />
                {dropdownAberto &&
                  dropdownRect &&
                  typeof document !== 'undefined' &&
                  createPortal(
                    <div ref={portalRef}>
                      {resultados.length > 0 ? (
                        <div style={dropdownPortalStyle(dropdownRect.top, dropdownRect.left, dropdownRect.width)} role="listbox">
                          {resultados.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              style={resultItemStyle}
                              onClick={() => selecionarCliente(c)}
                              disabled={selecionandoCliente}
                            >
                              <div style={resultAvatarStyle} aria-hidden>
                                {getInitial(c.nome || c.email)}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <span style={resultLabelStyle}>{c.nomeFantasia || c.razaoSocial}</span>
                                <span style={resultMetaStyle}>{c.nome} · {c.email}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : busca.trim().length >= 1 && !buscando ? (
                        <div
                          style={{
                            ...dropdownPortalStyle(dropdownRect.top, dropdownRect.left, dropdownRect.width),
                            padding: spacing[4],
                            color: colors.text.light,
                            opacity: 0.8,
                          }}
                        >
                          Nenhum cliente encontrado.
                        </div>
                      ) : null}
                    </div>,
                    document.body
                  )}
              </div>
              {selectedCliente && (
                <div style={selectedWrapStyle}>
                  Cliente selecionado: <strong>{selectedCliente.nomeFantasia || selectedCliente.razaoSocial}</strong> — {selectedCliente.nome} · {selectedCliente.email}
                  {' '}
                  <button
                    type="button"
                    onClick={() => setSelectedCliente(null)}
                    style={{ marginLeft: spacing[2], color: colors.blue.primary, background: 'none', border: 'none', cursor: 'pointer', fontSize: fontSizes.sm }}
                  >
                    Trocar
                  </button>
                </div>
              )}
            </div>
          </section>

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
                            style={{ ...resultItemStyle, marginBottom: spacing[1] }}
                            onClick={() => selecionarServico(s)}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={resultLabelStyle}>{s.nome}</span>
                            </div>
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
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tem manutenção?</label>
                <select
                  style={inputStyle}
                  value={temManutencao}
                  onChange={(e) => setTemManutencao(e.target.value === 'sim' ? 'sim' : '')}
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
                  disabled={temManutencao !== 'sim'}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Forma de pagamento do projeto</label>
                <select
                  style={inputStyle}
                  value={formaPagamentoProjeto}
                  onChange={(e) => setFormaPagamentoProjeto(e.target.value)}
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

          <div style={{ marginTop: spacing[6] }}>
            <ButtonPainel type="submit" disabled={loading || !selectedCliente}>
              {loading ? 'Salvando...' : 'Adicionar contrato'}
            </ButtonPainel>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
