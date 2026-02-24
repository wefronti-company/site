import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { theme } from '../../../../styles/theme';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import type { ParticipanteListItem } from '../../../../lib/usuarioDb';
import type { Comissao } from '../../../../lib/comissaoDb';

const DEBOUNCE_MS = 300;

const { colors, spacing, fontSizes } = theme;

const PERCENTUAL = 10;

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
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: spacing[4],
  maxWidth: 640,
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

const pixReadOnlyStyle: React.CSSProperties = {
  ...inputStyle,
  opacity: 0.9,
  backgroundColor: 'rgba(0,0,0,0.2)',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[3],
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[4],
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
};

const searchDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 2,
  maxHeight: 280,
  overflowY: 'auto',
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  zIndex: 10,
};

const searchOptionStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: `${spacing[2]}px ${spacing[3]}px`,
  textAlign: 'left',
  border: 'none',
  background: 'none',
  color: colors.text.light,
  fontSize: fontSizes.sm,
  cursor: 'pointer',
};

const searchOptionHoverStyle = { ...searchOptionStyle, backgroundColor: 'rgba(255,255,255,0.06)' };

function formatBRL(val: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return iso;
  }
}

interface ComissaoAdmin extends Comissao {
  nomeParticipante?: string;
  emailParticipante?: string;
}

export default function ComissaoPage() {
  const { showSuccess, showError } = useSnackbar();
  const [comissoes, setComissoes] = useState<ComissaoAdmin[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [usuarioId, setUsuarioId] = useState('');
  const [participanteSelecionado, setParticipanteSelecionado] = useState<ParticipanteListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ParticipanteListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [empresaIndicada, setEmpresaIndicada] = useState('');
  const [valorContrato, setValorContrato] = useState('');

  const valorNum = parseFloat(String(valorContrato || '0').replace(',', '.').replace(/\s/g, '')) || 0;
  const valorComissao = Math.round(valorNum * (PERCENTUAL / 100) * 100) / 100;

  const runSearch = useCallback((q: string) => {
    if (q.trim().length < 2) {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }
    setSearchLoading(true);
    setDropdownOpen(true);
    fetch(`/api/admin/indicacao/participantes?q=${encodeURIComponent(q.trim())}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setSearchResults(Array.isArray(data) ? data : []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchQuery, runSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectParticipante = (p: ParticipanteListItem) => {
    setUsuarioId(p.id);
    setParticipanteSelecionado(p);
    setSearchQuery('');
    setSearchResults([]);
    setDropdownOpen(false);
  };

  const clearParticipante = () => {
    setUsuarioId('');
    setParticipanteSelecionado(null);
    setSearchQuery('');
    setSearchResults([]);
    setDropdownOpen(false);
  };

  const loadComissoes = () => {
    fetch('/api/admin/indicacao/comissoes', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setComissoes(Array.isArray(data) ? data : []))
      .catch(() => setComissoes([]))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    loadComissoes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId.trim()) {
      showError('Selecione o participante.');
      return;
    }
    if (!empresaIndicada.trim()) {
      showError('Informe a empresa indicada.');
      return;
    }
    if (!valorNum || valorNum <= 0) {
      showError('Informe o valor do contrato.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/indicacao/comissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          usuarioId,
          empresaIndicada: empresaIndicada.trim(),
          valorContrato: valorNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao registrar comissão.');
        return;
      }
      showSuccess('Comissão registrada. O participante verá em Minhas comissões.');
      setEmpresaIndicada('');
      setValorContrato('');
      loadComissoes();
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Comissão | Indique e Ganhe | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Pagamento de comissão</h1>
        <p style={{ margin: 0, marginBottom: spacing[6], color: colors.text.light, opacity: 0.8 }}>
          Registre o pagamento de comissão ao participante. O valor é {PERCENTUAL}% do contrato fechado com a empresa indicada.
        </p>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Registrar comissão</h2>
          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              <div style={{ ...fieldStyle, position: 'relative' }} ref={searchRef}>
                <label style={labelStyle}>Participante *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    style={inputStyle}
                    value={participanteSelecionado ? `${participanteSelecionado.nomeCompleto || participanteSelecionado.email} (${participanteSelecionado.codigoReferencia})` : searchQuery}
                    onChange={(e) => {
                      if (!participanteSelecionado) setSearchQuery(e.target.value);
                    }}
                    onFocus={() => { if (searchResults.length > 0) setDropdownOpen(true); }}
                    placeholder="Pesquisar por nome, e-mail, CPF ou código de indicação"
                    disabled={saving}
                    autoComplete="off"
                  />
                  {participanteSelecionado && (
                    <button
                      type="button"
                      onClick={clearParticipante}
                      style={{ position: 'absolute', right: spacing[2], top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: colors.text.light, opacity: 0.8, cursor: 'pointer', fontSize: fontSizes.sm, padding: spacing[1] }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
                {dropdownOpen && (searchResults.length > 0 || searchLoading) && !participanteSelecionado && (
                  <div style={searchDropdownStyle}>
                    {searchLoading ? (
                      <div style={{ ...searchOptionStyle, opacity: 0.7 }}>Buscando...</div>
                    ) : (
                      searchResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          style={searchOptionStyle}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, searchOptionHoverStyle)}
                          onMouseLeave={(e) => Object.assign(e.currentTarget.style, searchOptionStyle)}
                          onClick={() => selectParticipante(p)}
                        >
                          {p.nomeCompleto || p.email} ({p.codigoReferencia})
                          {p.nomeCompleto && p.email ? ` · ${p.email}` : ''}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {participanteSelecionado && (
                <>
                  <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Chave PIX do participante</label>
                    <input
                      type="text"
                      style={pixReadOnlyStyle}
                      value={participanteSelecionado.chavePix || '—'}
                      readOnly
                      disabled
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Banco</label>
                    <input
                      type="text"
                      style={pixReadOnlyStyle}
                      value={participanteSelecionado.banco || '—'}
                      readOnly
                      disabled
                    />
                  </div>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Nome do titular</label>
                    <input
                      type="text"
                      style={pixReadOnlyStyle}
                      value={participanteSelecionado.nomeTitular || '—'}
                      readOnly
                      disabled
                    />
                  </div>
                  <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                    <small style={{ color: colors.text.light, opacity: 0.6 }}>
                      Dados do perfil do participante. Para alterar, edite em Participantes.
                    </small>
                  </div>
                </>
              )}
              <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Empresa indicada *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={empresaIndicada}
                  onChange={(e) => setEmpresaIndicada(e.target.value)}
                  placeholder="Nome da empresa que fechou o contrato"
                  maxLength={200}
                  required
                  disabled={saving}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Valor do contrato (R$) *</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={valorContrato}
                  onChange={(e) => setValorContrato(e.target.value)}
                  placeholder="Ex: 1500,00"
                  required
                  disabled={saving}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Comissão ({PERCENTUAL}%)</label>
                <input
                  type="text"
                  style={pixReadOnlyStyle}
                  value={valorComissao > 0 ? formatBRL(valorComissao) : '—'}
                  readOnly
                  disabled
                />
              </div>
            </div>
            <div style={{ marginTop: spacing[6] }}>
              <ButtonPainel type="submit" disabled={saving}>
                {saving ? 'Registrando...' : 'Registrar comissão'}
              </ButtonPainel>
            </div>
          </form>
        </section>

        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Comissões registradas</h2>
          {loadingList ? (
            <div style={listStyle}>
              <div style={{ ...cardStyle, minHeight: 70, opacity: 0.55 }} />
              <div style={{ ...cardStyle, minHeight: 70, opacity: 0.45 }} />
            </div>
          ) : comissoes.length === 0 ? (
            <p style={cardMetaStyle}>Nenhuma comissão registrada ainda.</p>
          ) : (
            <div style={listStyle}>
              {comissoes.map((c) => (
                <div key={c.id} style={cardStyle}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[2], alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, color: colors.text.light }}>
                      {(c as ComissaoAdmin).nomeParticipante || 'Participante'} · {(c as ComissaoAdmin).emailParticipante || ''}
                    </span>
                    <span style={{ color: colors.blue.primary, fontWeight: 600 }}>{formatBRL(c.valorComissao)}</span>
                  </div>
                  <p style={cardMetaStyle}>
                    Empresa indicada: {c.empresaIndicada} · Contrato: {formatBRL(c.valorContrato)} · {formatDate(c.criadoEm)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </AdminLayout>
    </>
  );
}
