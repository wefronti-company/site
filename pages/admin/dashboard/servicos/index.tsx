import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Servico } from '../../../../lib/servicosDb';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Plus } from 'lucide-react';

const { colors, spacing, fontSizes, radii } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: spacing[3],
};

/** Estilo igual à tab do sidebar: pequena div com borda e fundo */
const cardTabStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  color: colors.text.light,
  fontSize: fontSizes.sm,
  opacity: 0.95,
  borderRadius: radii.md,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
};

const btnAddStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px`,
  color: colors.blue.primary,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  borderRadius: radii.md,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  cursor: 'pointer',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: spacing[4],
};

const modalStyle: React.CSSProperties = {
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  padding: spacing[5],
  maxWidth: 360,
  width: '100%',
};

const modalTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[3]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.sidebar,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  marginBottom: spacing[4],
};

const btnModalRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing[3],
  justifyContent: 'flex-end',
};

const btnCancelStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  backgroundColor: 'transparent',
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  cursor: 'pointer',
};

const btnSubmitStyle: React.CSSProperties = {
  padding: `${spacing[2]}px ${spacing[4]}px`,
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: '#fff',
  backgroundColor: colors.blue.primary,
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default function ServicosPage() {
  const { showSuccess, showError } = useSnackbar();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/servicos')
      .then((r) => r.json())
      .then((data) => {
        setServicos(Array.isArray(data) ? data : []);
      })
      .catch(() => setServicos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nome = novoNome.trim();
    if (!nome) {
      showError('Informe o nome do serviço.');
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch('/api/servicos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao adicionar serviço.');
        return;
      }
      showSuccess('Serviço adicionado.');
      setNovoNome('');
      setModalAberto(false);
      load();
    } catch {
      showError('Erro ao conectar.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Head>
        <title>Serviços | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Serviços</h1>
        <div style={rowStyle}>
          {loading ? (
            <span style={{ ...cardTabStyle, opacity: 0.6 }}>Carregando...</span>
          ) : (
            <>
              {servicos.map((s) => (
                <div key={s.id} style={cardTabStyle}>
                  {s.nome}
                </div>
              ))}
              <button
                type="button"
                style={btnAddStyle}
                onClick={() => setModalAberto(true)}
                aria-label="Adicionar serviço"
              >
                <Plus size={18} strokeWidth={2} /> Adicionar
              </button>
            </>
          )}
        </div>

        {modalAberto && (
          <div
            style={overlayStyle}
            onClick={() => !salvando && setModalAberto(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-servico-title"
          >
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <h2 id="modal-servico-title" style={modalTitleStyle}>
                Novo serviço
              </h2>
              <form onSubmit={handleAdicionar}>
                <input
                  type="text"
                  style={inputStyle}
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Site, Landing Page, Redesign..."
                  autoFocus
                  disabled={salvando}
                />
                <div style={btnModalRowStyle}>
                  <button
                    type="button"
                    style={btnCancelStyle}
                    onClick={() => !salvando && setModalAberto(false)}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                  <button type="submit" style={btnSubmitStyle} disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
