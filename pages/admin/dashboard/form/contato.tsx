import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Pagination, { paginate } from '../../../../components/admin/Pagination';
import ButtonPainel from '../../../../components/ui/ButtonPainel';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { theme } from '../../../../styles/theme';
import type { RequestRow } from '../../../../lib/requestDb';
import { X } from 'lucide-react';
import { HiOutlineMail } from 'react-icons/hi';

const { colors, spacing, fontSizes } = theme;

const pageTitleStyle: React.CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: 400,
  color: colors.text.light,
  margin: 0,
  marginBottom: spacing[4],
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
  padding: spacing[5],
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing[5],
};

const cardLeftStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
  flex: 1,
  minWidth: 0,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.text.light,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text.light,
  opacity: 0.8,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const btnDetalhesStyle: React.CSSProperties = {
  padding: '12px 24px',
  fontSize: 16,
  fontWeight: 500,
  color: colors.blue.primary,
  background: 'transparent',
  border: `1px solid ${colors.blue.primary}`,
  borderRadius: 6,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getNomeCompleto(r: RequestRow): string {
  return [r.nome, r.sobrenome].filter(Boolean).join(' ').trim() || r.email;
}

const ContatoModal: React.FC<{
  request: RequestRow | null;
  onClose: () => void;
  onMarcarRespondido: () => void;
  loading?: boolean;
}> = ({ request, onClose, onMarcarRespondido, loading }) => {
  if (!request) return null;

  const mailto = `mailto:${request.email}?subject=Re: ${encodeURIComponent(request.investimento || 'Contato')}`;

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[1],
  };
  const labelStyle: React.CSSProperties = {
    fontSize: fontSizes.xs,
    fontWeight: 500,
    color: colors.text.light,
    opacity: 0.7,
  };
  const valueStyle: React.CSSProperties = {
    fontSize: fontSizes.sm,
    color: colors.text.light,
    padding: spacing[2],
    backgroundColor: colors.admin.inactive,
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: 6,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  };

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
      }}
      aria-modal
      aria-labelledby="modal-contato-title"
    >
      <div
        role="dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.admin.inactive,
          border: `1px solid ${colors.neutral.borderDark}`,
          borderRadius: 12,
          padding: spacing[6],
          maxWidth: 1024,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing[6] }}>
          <h3 id="modal-contato-title" style={{ margin: 0, fontSize: fontSizes.lg, fontWeight: 500, color: colors.text.light }}>
            Detalhes do contato
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            style={{
              border: 'none',
              background: 'transparent',
              color: colors.text.light,
              cursor: 'pointer',
              padding: spacing[1],
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4], marginBottom: spacing[6] }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: spacing[4] }}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Nome</span>
              <div style={valueStyle}>{getNomeCompleto(request)}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>E-mail</span>
              <div style={valueStyle}>{request.email}</div>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Assunto</span>
              <div style={valueStyle}>{request.investimento || '—'}</div>
            </div>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Mensagem</span>
            <div style={valueStyle}>{request.contexto}</div>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Enviado em</span>
            <div style={valueStyle}>{formatDateTime(request.criado_em)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3], flexWrap: 'wrap' }}>
          <a
            href={mailto}
            aria-label="Responder por e-mail"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 8,
              color: '#25D366',
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              textDecoration: 'none',
            }}
          >
            <HiOutlineMail size={24} />
          </a>
          <ButtonPainel onClick={onMarcarRespondido} disabled={loading}>
            {loading ? 'Marcando…' : 'Marcar como respondido'}
          </ButtonPainel>
        </div>
      </div>
    </div>
  );
};

const ContatoPage: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalRequest, setModalRequest] = useState<RequestRow | null>(null);
  const [marcandoId, setMarcandoId] = useState<string | null>(null);

  const load = (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/admin/requests?status=novo&tipo=Contato')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setRequests(list);
      })
      .catch(() => setRequests([]))
      .finally(() => {
        if (!silent) setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarcarRespondido = async () => {
    if (!modalRequest) return;
    const id = modalRequest.id;
    setMarcandoId(id);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: 'PATCH' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        showError(data.error || 'Erro ao marcar como respondido.');
        return;
      }
      setModalRequest(null);
      showSuccess('Contato marcado como respondido.');
      load({ silent: true });
    } catch {
      showError('Erro ao conectar. Tente novamente.');
    } finally {
      setMarcandoId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(requests.length / 10));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  return (
    <>
      <Head>
        <title>Contato | Wefronti</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout>
        <h1 style={pageTitleStyle}>Contato</h1>
        {loading ? (
          <div style={listStyle}>
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.55 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.45 }} />
            <div style={{ ...cardStyle, minHeight: 68, opacity: 0.35 }} />
          </div>
        ) : requests.length === 0 ? (
          <p style={cardMetaStyle}>Nenhum contato novo.</p>
        ) : (
          <>
            <div style={listStyle}>
              {paginate(requests, page).map((r) => (
                <div key={r.id} style={cardStyle}>
                  <div style={cardLeftStyle}>
                    <span style={cardLabelStyle}>{getNomeCompleto(r)}</span>
                    <span style={cardMetaStyle}>{r.email}</span>
                    <span style={cardMetaStyle}>Assunto: {r.investimento || '—'}</span>
                    <span style={{ ...cardMetaStyle, fontSize: fontSizes.xs, opacity: 0.6 }}>
                      {formatDateTime(r.criado_em)}
                    </span>
                  </div>
                  <button type="button" onClick={() => setModalRequest(r)} style={btnDetalhesStyle}>
                    Detalhes
                  </button>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalItems={requests.length}
              onPageChange={setPage}
            />
          </>
        )}

        {modalRequest && (
          <ContatoModal
            request={modalRequest}
            onClose={() => setModalRequest(null)}
            onMarcarRespondido={handleMarcarRespondido}
            loading={marcandoId === modalRequest.id}
          />
        )}
      </AdminLayout>
    </>
  );
};

export default ContatoPage;
