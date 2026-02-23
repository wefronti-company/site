import React, { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { theme } from '../../../../styles/theme';
import type { Proposal, ProposalItem } from '../../../../lib/proposalData';
import { PropostaTemplate } from '../../../../components/proposta/PropostaTemplate';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { useSnackbar } from '../../../../contexts/SnackbarContext';

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

const emptyProposal: Proposal = {
  slug: 'exemplo',
  codigo: 'PROP-PREVIEW',
  cliente: 'Nome do cliente',
  empresa: 'Empresa LTDA',
  enviadoEm: new Date().toISOString(),
  itens: [
    { descricao: 'Site completo', valor: 3500 },
    { descricao: 'Landing Page', valor: 500 },
  ],
  observacoes: 'Proposta válida por 24 horas.',
};

const PropostaNovaPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [slug, setSlug] = useState('');
  const [cliente, setCliente] = useState('');
  const [itens, setItens] = useState<ProposalItem[]>([
    { descricao: 'Site', valor: 0 },
  ]);
  const [manutencao, setManutencao] = useState<'sim' | ''>('');
  const [manutencaoPreco, setManutencaoPreco] = useState<number>(0);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [generatedCodigo, setGeneratedCodigo] = useState<string | null>(null);

  const previewItens = [
    ...itens
      .filter((i) => i.descricao.trim())
      .map((i) => ({ descricao: i.descricao.trim(), valor: Number(i.valor) || 0 })),
    ...(manutencao === 'sim' && Number(manutencaoPreco) > 0
      ? [{ descricao: 'Manutenção', valor: Number(manutencaoPreco) }]
      : []),
  ];

  const previewProposal: Proposal = {
    slug: slug || 'exemplo',
    codigo: 'PROP-PREVIEW',
    cliente: cliente || 'Nome do cliente',
    empresa: slug.trim() || undefined,
    enviadoEm: new Date().toISOString(),
    itens: previewItens.length > 0 ? previewItens : emptyProposal.itens,
    observacoes: emptyProposal.observacoes,
  };

  const updateItem = (i: number, field: 'descricao' | 'valor', value: string | number) => {
    setItens((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const generateProposal = async () => {
    const erros: string[] = [];
    if (!slug.trim()) erros.push('Nome da empresa');
    if (!cliente.trim()) erros.push('Cliente');
    if (!itens[0]?.descricao?.trim()) erros.push('Serviços');
    const valor = Number(itens[0]?.valor);
    if (!valor || valor <= 100) erros.push('Preço');
    if (erros.length > 0) {
      showError('Todos os campos são obrigatórios.');
      return;
    }
    try {
      const res = await fetch('/api/proposta/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: slug.trim(),
          cliente: cliente.trim(),
          servico: itens[0]?.descricao?.trim() || 'Site',
          preco: Number(itens[0]?.valor) || 0,
          manutencao: manutencao || '',
          precoManutencao: manutencao === 'sim' ? Number(manutencaoPreco) || 0 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.error || 'Erro ao gerar proposta.');
        return;
      }
      setGeneratedLink(data.link);
      setGeneratedCodigo(data.codigo || null);
      await navigator.clipboard.writeText(data.link);
      showSuccess('Proposta gerada com sucesso. Link copiado para a área de transferência.');
    } catch (e) {
      showError('Erro ao conectar. Tente novamente.');
    }
  };

  return (
    <>
      <Head>
        <title>Nova proposta | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={titleStyle}>Nova proposta</h1>

        <div className="proposta-nova-grid">
          <div style={formStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <label style={labelStyle}>Nome da empresa *</label>
              <input
                type="text"
                style={inputStyle}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Nome da empresa"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <label style={labelStyle}>Serviços *</label>
              <select
                style={inputStyle}
                value={itens[0]?.descricao ?? TIPOS_SERVICO[0].value}
                onChange={(e) => updateItem(0, 'descricao', e.target.value)}
                required
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
                pattern="[0-9]*"
                min={1}
                className="input-no-spinner"
                style={inputStyle}
                value={itens[0]?.valor ?? ''}
                onChange={(e) => updateItem(0, 'valor', e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
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
                pattern="[0-9]*"
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

            {generatedLink && (
              <div
                style={{
                  padding: spacing[4],
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: 8,
                  fontSize: fontSizes.sm,
                  color: '#4ade80',
                }}
              >
                {generatedCodigo && (
                  <p style={{ margin: 0, marginBottom: spacing[2] }}>
                    <strong>Código da proposta:</strong> {generatedCodigo}
                  </p>
                )}
                <p style={{ margin: 0 }}>
                  Link copiado: <br />
                  <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ color: colors.blue.primary, wordBreak: 'break-all' }}>
                    {generatedLink}
                  </a>
                </p>
              </div>
            )}

            <ButtonPainel onClick={generateProposal}>
              Gerar proposta
            </ButtonPainel>
          </div>

          <div style={templateWrapStyle}>
            <div
              style={{
                ...templateHeaderStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing[3],
              }}
            >
              <span>Proposta</span>
              <a
                href="/admin/dashboard/proposta/preview"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  localStorage.setItem('proposta-preview', JSON.stringify(previewProposal));
                }}
                style={{
                  fontSize: fontSizes.xs,
                  color: colors.blue.primary,
                  textDecoration: 'none',
                }}
              >
                Ver proposta
              </a>
            </div>
            <div style={previewWrapStyle}>
              <PropostaTemplate proposal={previewProposal} showCountdown={false} />
            </div>
          </div>
        </div>

        <style jsx global>{`
          .input-no-spinner::-webkit-inner-spin-button,
          .input-no-spinner::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .input-no-spinner {
            -moz-appearance: textfield;
          }
          .proposta-nova-grid input:focus,
          .proposta-nova-grid select:focus,
          .proposta-nova-grid textarea:focus {
            outline: none;
            box-shadow: none;
          }
        `}</style>
        <style jsx>{`
          .proposta-nova-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            align-items: start;
          }
          @media (max-width: 768px) {
            .proposta-nova-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </AdminLayout>
    </>
  );
};

export default PropostaNovaPage;
