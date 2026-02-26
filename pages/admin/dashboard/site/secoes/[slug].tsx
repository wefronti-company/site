import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { theme } from '@/styles/theme';
import { useSnackbar } from '@/contexts/SnackbarContext';
import ButtonPainel from '@/components/ui/ButtonPainel';
import { ArrowLeft } from 'lucide-react';
import { isSecaoValida } from '@/lib/siteConteudoDb';

const { colors, spacing, fontSizes } = theme;

const SLUG_TO_TITLE: Record<string, string> = {
  hero: 'Seção Hero',
  technology: 'Tecnologia',
  testimonials: 'Depoimentos',
  timeline: 'Timeline',
  portfolio: 'Portfólio',
  about: 'Sobre',
  pricing: 'Preços',
  comparison: 'Comparação',
  faq: 'Perguntas frequentes',
  cta: 'Chamada para ação',
  footer: 'Footer',
};

const linkVoltarStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing[2],
  color: colors.blue.primary,
  textDecoration: 'none',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  marginBottom: spacing[6],
};

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[6],
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[6],
  maxWidth: 640,
};

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: spacing[1] };
const labelStyle: React.CSSProperties = { fontSize: fontSizes.sm, fontWeight: 500, color: colors.text.light };
const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: `${spacing[3]}px ${spacing[4]}px`,
  fontSize: fontSizes.base,
  minHeight: 44,
  color: colors.text.light,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
  outline: 'none',
};
const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  resize: 'vertical',
};

export default function EditarSecaoPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { showSuccess, showError } = useSnackbar();
  const slugStr = typeof slug === 'string' ? slug : '';
  const titulo = SLUG_TO_TITLE[slugStr] ?? (slugStr || 'Seção');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dados, setDados] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!slugStr || !isSecaoValida(slugStr)) return;
    setLoading(true);
    fetch(`/api/site/conteudo/${slugStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error);
          return;
        }
        setDados(typeof data.dados === 'object' && data.dados !== null ? data.dados as Record<string, unknown> : {});
      })
      .catch(() => showError('Erro ao carregar conteúdo.'))
      .finally(() => setLoading(false));
  }, [slugStr, showError]);

  const updateCampo = (key: string, value: unknown) => {
    setDados((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugStr || !isSecaoValida(slugStr)) return;
    setSaving(true);
    fetch(`/api/site/conteudo/${slugStr}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ dados }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          showError(data.error);
          return;
        }
        showSuccess('Conteúdo salvo.');
        if (data.dados) setDados(data.dados as Record<string, unknown>);
      })
      .catch(() => showError('Erro ao salvar.'))
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Editar {titulo} | Admin | Wefronti</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout>
          <Link href="/admin/dashboard/site/secoes" style={linkVoltarStyle}>
            <ArrowLeft size={18} />
            Voltar para seções
          </Link>
          <p style={{ color: colors.text.light, opacity: 0.8 }}>Carregando...</p>
        </AdminLayout>
      </>
    );
  }

  const str = (v: unknown) => (v != null ? String(v) : '');
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x ?? '')) : []);

  return (
    <>
      <Head>
        <title>Editar {titulo} | Admin | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <Link href="/admin/dashboard/site/secoes" style={linkVoltarStyle} aria-label="Voltar para seções">
          <ArrowLeft size={18} />
          Voltar para seções
        </Link>
        <h1 style={pageTitleStyle}>Editar: {titulo}</h1>

        <form onSubmit={handleSubmit} style={formStyle}>
          {/* Hero */}
          {slugStr === 'hero' && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Título</label>
                <input
                  type="text"
                  value={str(dados.titulo)}
                  onChange={(e) => updateCampo('titulo', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Subtítulo</label>
                <textarea
                  value={str(dados.subtitulo)}
                  onChange={(e) => updateCampo('subtitulo', e.target.value)}
                  style={textareaStyle}
                  rows={3}
                />
              </div>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={fieldStyle}>
                  <label style={labelStyle}>Chip {i + 1}</label>
                  <input
                    type="text"
                    value={arr(dados.chips)[i] ?? ''}
                    onChange={(e) => {
                      const chips = arr(dados.chips);
                      chips[i] = e.target.value;
                      updateCampo('chips', chips);
                    }}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={fieldStyle}>
                <label style={labelStyle}>Botão principal</label>
                <input
                  type="text"
                  value={str(dados.botaoPrincipal)}
                  onChange={(e) => updateCampo('botaoPrincipal', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Botão secundário</label>
                <input
                  type="text"
                  value={str(dados.botaoSecundario)}
                  onChange={(e) => updateCampo('botaoSecundario', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* About */}
          {slugStr === 'about' && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Badge</label>
                <input
                  type="text"
                  value={str(dados.badge)}
                  onChange={(e) => updateCampo('badge', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Título</label>
                <input
                  type="text"
                  value={str(dados.titulo)}
                  onChange={(e) => updateCampo('titulo', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  value={str(dados.descricao)}
                  onChange={(e) => updateCampo('descricao', e.target.value)}
                  style={textareaStyle}
                  rows={5}
                />
              </div>
            </>
          )}

          {/* CTA */}
          {slugStr === 'cta' && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Título</label>
                <input
                  type="text"
                  value={str(dados.titulo)}
                  onChange={(e) => updateCampo('titulo', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Subtítulo</label>
                <textarea
                  value={str(dados.subtitulo)}
                  onChange={(e) => updateCampo('subtitulo', e.target.value)}
                  style={textareaStyle}
                  rows={3}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Texto do botão</label>
                <input
                  type="text"
                  value={str(dados.botao)}
                  onChange={(e) => updateCampo('botao', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Mensagem WhatsApp (pré-preenchida)</label>
                <input
                  type="text"
                  value={str(dados.mensagemWhatsApp)}
                  onChange={(e) => updateCampo('mensagemWhatsApp', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* Footer */}
          {slugStr === 'footer' && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Label das redes</label>
                <input
                  type="text"
                  value={str(dados.redesLabel)}
                  onChange={(e) => updateCampo('redesLabel', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Texto CNPJ / rodapé</label>
                <input
                  type="text"
                  value={str(dados.cnpjTexto)}
                  onChange={(e) => updateCampo('cnpjTexto', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {/* Seções com badge + título + subtítulo genérico */}
          {['technology', 'testimonials', 'timeline', 'portfolio', 'pricing', 'comparison'].includes(slugStr) && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Badge</label>
                <input
                  type="text"
                  value={str(dados.badge)}
                  onChange={(e) => updateCampo('badge', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Título</label>
                <textarea
                  value={str(dados.titulo).replace(/\\n/g, '\n')}
                  onChange={(e) => updateCampo('titulo', e.target.value.replace(/\n/g, '\\n'))}
                  style={textareaStyle}
                  rows={2}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Subtítulo / Intro</label>
                <textarea
                  value={str(dados.subtitulo || dados.intro)}
                  onChange={(e) => updateCampo(slugStr === 'technology' ? 'intro' : 'subtitulo', e.target.value)}
                  style={textareaStyle}
                  rows={4}
                />
              </div>
              {slugStr === 'technology' && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Texto do botão</label>
                  <input
                    type="text"
                    value={str(dados.botao)}
                    onChange={(e) => updateCampo('botao', e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}
            </>
          )}

          {/* FAQ */}
          {slugStr === 'faq' && (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle}>Badge</label>
                <input
                  type="text"
                  value={str(dados.badge)}
                  onChange={(e) => updateCampo('badge', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Título</label>
                <input
                  type="text"
                  value={str(dados.titulo)}
                  onChange={(e) => updateCampo('titulo', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <p style={{ color: colors.text.light, opacity: 0.8, fontSize: fontSizes.sm }}>
                Itens de FAQ (pergunta e resposta) estão no conteúdo. Edição avançada em breve.
              </p>
            </>
          )}

          <div style={{ marginTop: spacing[4] }}>
            <ButtonPainel type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </ButtonPainel>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
