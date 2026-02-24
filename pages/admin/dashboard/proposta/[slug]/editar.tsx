import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../../components/admin/AdminLayout';
import { theme } from '../../../../../styles/theme';
import type { Proposal } from '../../../../../lib/proposalData';
import { PropostaTemplate } from '../../../../../components/proposta/PropostaTemplate';
import ButtonPainel from '../../../../../components/ui/ButtonPainel';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';

const { colors, spacing, fontSizes } = theme;

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  fontWeight: 600,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
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
  borderRadius: 6,
};

const templateWrapStyle: React.CSSProperties = {
  position: 'sticky',
  top: spacing[8],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 12,
  overflow: 'hidden',
};

const templateHeaderStyle: React.CSSProperties = {
  padding: spacing[3],
  borderBottom: `1px solid ${colors.neutral.borderDark}`,
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const previewWrapStyle: React.CSSProperties = {
  maxHeight: 560,
  overflow: 'auto',
  transform: 'scale(0.7)',
  transformOrigin: 'top left',
  width: '143%',
};

const TIPOS_SERVICO = [
  { value: 'Site', label: 'Site' },
  { value: 'Landing Page', label: 'Landing Page' },
] as const;

const OPCOES_MANUTENCAO = [
  { value: '', label: 'Sem manutenção' },
  { value: 'sim', label: 'Manutenção' },
] as const;

const PropostaEditarPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { showSuccess, showError } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [empresa, setEmpresa] = useState('');
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState<'Site' | 'Landing Page'>('Site');
  const [preco, setPreco] = useState<number>(0);
  const [manutencao, setManutencao] = useState<'sim' | ''>('');
  const [manutencaoPreco, setManutencaoPreco] = useState<number>(0);

  useEffect(() => {
    if (typeof slug !== 'string') return;
    fetch(`/api/proposta/${slug}/dados`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error || 'Proposta não encontrada.');
          return;
        }
        setEmpresa(data.empresa ?? '');
        setCliente(data.cliente ?? '');
        const s = data.itens?.[0]?.descricao;
        setServico(s === 'Landing Page' ? 'Landing Page' : 'Site');
        setPreco(data.itens?.[0]?.valor ?? 0);
        const temManut = data.itens?.some((i: { descricao: string }) => i.descricao === 'Manutenção');
        if (temManut) {
          const val = data.itens?.find((i: { descricao: string }) => i.descricao === 'Manutenção')?.valor ?? 0;
          setManutencao('sim');
          setManutencaoPreco(val);
        } else {
          setManutencao('');
          setManutencaoPreco(0);
        }
      })
      .catch(() => showError('Erro ao carregar proposta.'))
      .finally(() => setLoadingData(false));
  }, [slug, showError]);

  const previewProposal: Proposal = {
    slug: String(slug || ''),
    codigo: 'PROP-PREVIEW',
    cliente: cliente || 'Nome do cliente',
    empresa: empresa.trim() || undefined,
    enviadoEm: new Date().toISOString(),
    itens: [
      { descricao: servico, valor: preco },
      ...(manutencao === 'sim' && manutencaoPreco > 0 ? [{ descricao: 'Manutenção', valor: manutencaoPreco }] : []),
    ],
    observacoes: 'Proposta válida por 24 horas após o envio.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof slug !== 'string') return;
    if (!empresa.trim() || !cliente.trim()) {
      showError('Preencha empresa e cliente.');
      return;
    }
    if (!preco || preco < 100) {
      showError('Preço inválido (mínimo R$ 100).');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/proposta/${slug}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: empresa.trim(),
          cliente: cliente.trim(),
          servico,
          preco,
          manutencao,
          precoManutencao: manutencao === 'sim' ? manutencaoPreco : 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        showError(data.error || 'Erro ao atualizar.');
        return;
      }
      showSuccess('Proposta atualizada com sucesso.');
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
          <title>Editar proposta | Wefronti</title>
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
        <title>Editar proposta | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Editar proposta</h1>

        <form className="proposta-editar-grid" onSubmit={handleSubmit}>
          <div style={formStyle}>
            <div>
              <label style={labelStyle}>Nome da empresa *</label>
              <input
                type="text"
                style={inputStyle}
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Nome da empresa"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Cliente *</label>
              <input
                type="text"
                style={inputStyle}
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Nome do cliente"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Serviços *</label>
              <select
                style={inputStyle}
                value={servico}
                onChange={(e) => setServico(e.target.value === 'Landing Page' ? 'Landing Page' : 'Site')}
              >
                {TIPOS_SERVICO.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ backgroundColor: colors.admin.inactive }}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label style={{ ...labelStyle, marginTop: spacing[3] }}>Preço *</label>
              <input
                type="number"
                inputMode="numeric"
                min={100}
                className="input-no-spinner"
                style={inputStyle}
                value={preco || ''}
                onChange={(e) => setPreco(Number(e.target.value) || 0)}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Manutenção</label>
              <select
                style={inputStyle}
                value={manutencao}
                onChange={(e) => setManutencao(e.target.value === 'sim' ? 'sim' : '')}
              >
                {OPCOES_MANUTENCAO.map((opt) => (
                  <option key={opt.value || 'vazio'} value={opt.value} style={{ backgroundColor: colors.admin.inactive }}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <label style={{ ...labelStyle, marginTop: spacing[3] }}>Preço manutenção</label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                className="input-no-spinner"
                style={{
                  ...inputStyle,
                  opacity: manutencao !== 'sim' ? 0.6 : 1,
                  cursor: manutencao !== 'sim' ? 'not-allowed' : undefined,
                }}
                value={manutencaoPreco || ''}
                onChange={(e) => setManutencaoPreco(Number(e.target.value) || 0)}
                placeholder="0"
                disabled={manutencao !== 'sim'}
              />
            </div>

            <ButtonPainel type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Atualizar'}
            </ButtonPainel>
          </div>

          <div style={templateWrapStyle}>
            <div style={templateHeaderStyle}>
              <span>Preview</span>
            </div>
            <div style={previewWrapStyle}>
              <PropostaTemplate proposal={previewProposal} showCountdown={false} />
            </div>
          </div>
        </form>

        <style jsx global>{`
          .input-no-spinner::-webkit-inner-spin-button,
          .input-no-spinner::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .input-no-spinner {
            -moz-appearance: textfield;
          }
          .proposta-editar-grid input:focus,
          .proposta-editar-grid select:focus {
            outline: none;
            box-shadow: none;
          }
        `}</style>
        <style jsx>{`
          .proposta-editar-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            align-items: start;
          }
          @media (max-width: 768px) {
            .proposta-editar-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </AdminLayout>
    </>
  );
};

export default PropostaEditarPage;
