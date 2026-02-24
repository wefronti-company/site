import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, Bell } from 'lucide-react';
import { theme } from '../../styles/theme';
import { DASH_HEADER_HEIGHT, DASH_SIDEBAR_WIDTH } from './constants';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { useDashUsuario } from '../../contexts/DashUsuarioContext';

const { colors, spacing, fontSizes, breakpoints } = theme;
const NOTIFICATION_POLL_MS = 3000;
const NOTIFICATION_SEEN_KEY = 'dash_notif_seen_v1';

interface NotificacaoItem {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string | null;
  lidaEm: string | null;
  criadaEm: string;
}

interface DashHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Agora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min atrás`;
    if (diff < 86400000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

function extractCurrency(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = text.match(/R\$\s?[\d\.\,]+/);
  return m ? m[0].replace(/\s+/g, ' ') : null;
}

export const DashHeader: React.FC<DashHeaderProps> = ({ title, onMenuClick }) => {
  const { showSuccess, showError } = useSnackbar();
  const { refetch: refetchUsuario } = useDashUsuario();
  const isMd = useMediaQuery(breakpoints.md);
  const [notificacoes, setNotificacoes] = useState<NotificacaoItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const seenReadyRef = useRef(false);

  const persistSeen = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(seenIdsRef.current).slice(-100);
      window.sessionStorage.setItem(NOTIFICATION_SEEN_KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(NOTIFICATION_SEEN_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        if (Array.isArray(arr)) seenIdsRef.current = new Set(arr);
      }
    } catch {
      // ignore
    } finally {
      seenReadyRef.current = true;
    }
  }, []);

  const fetchNotificacoes = useCallback((opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/usuario/notificacoes', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const list: NotificacaoItem[] = Array.isArray(data?.notificacoes) ? data.notificacoes : [];
        const unread = typeof data?.unreadCount === 'number' ? data.unreadCount : Number(data?.unreadCount || 0);
        setNotificacoes(list);
        setUnreadCount(Number.isFinite(unread) ? unread : 0);

        if (!seenReadyRef.current) return;

        const nextSeen = new Set(seenIdsRef.current);
        let newestUnreadUnseen: NotificacaoItem | null = null;
        for (const n of list) {
          if (n.lidaEm) continue;
          if (!nextSeen.has(n.id)) {
            if (!newestUnreadUnseen) newestUnreadUnseen = n;
            nextSeen.add(n.id);
          }
        }

        if (newestUnreadUnseen) {
          if (newestUnreadUnseen.tipo === 'banimento') {
            showError('Sua conta foi banida.');
            refetchUsuario();
          } else if (newestUnreadUnseen.tipo === 'status_usuario') {
            showSuccess('Sua conta foi liberada.');
            refetchUsuario();
          } else if (newestUnreadUnseen.tipo === 'comissao') {
            const value = extractCurrency(newestUnreadUnseen.mensagem);
            showSuccess(value ? `Você recebeu nova comissão de ${value}.` : 'Você recebeu nova comissão.');
            refetchUsuario();
          } else {
            showSuccess('Você recebeu uma nova notificação.');
          }
        }

        seenIdsRef.current = nextSeen;
        persistSeen();
      })
      .catch(() => {})
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, [showError, showSuccess, refetchUsuario, persistSeen]);

  useEffect(() => {
    fetchNotificacoes();
  }, [fetchNotificacoes]);

  useEffect(() => {
    if (!open) return;
    fetchNotificacoes();
  }, [open, fetchNotificacoes]);

  useEffect(() => {
    const t = setInterval(() => fetchNotificacoes({ silent: true }), NOTIFICATION_POLL_MS);
    return () => clearInterval(t);
  }, [fetchNotificacoes]);

  useEffect(() => {
    const onFocus = () => fetchNotificacoes({ silent: true });
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchNotificacoes({ silent: true });
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchNotificacoes]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAsRead = (id: string) => {
    fetch('/api/usuario/notificacoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id }),
    })
      .then(() => {
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, lidaEm: new Date().toISOString() } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      })
      .catch(() => {});
  };

  const markAllAsRead = () => {
    fetch('/api/usuario/notificacoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ todos: true }),
    })
      .then(() => {
        setNotificacoes((prev) => prev.map((n) => ({ ...n, lidaEm: n.lidaEm || new Date().toISOString() })));
        setUnreadCount(0);
      })
      .catch(() => {});
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isMd ? DASH_SIDEBAR_WIDTH : 0,
    right: 0,
    height: DASH_HEADER_HEIGHT,
    minHeight: DASH_HEADER_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    gap: spacing[4],
    paddingLeft: isMd ? spacing[6] : spacing[4],
    paddingRight: spacing[6],
    backgroundColor: colors.admin.background,
    borderBottom: `1px solid ${colors.neutral.borderDark}`,
    zIndex: 30,
  };

  const iconBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    padding: 0,
    border: 'none',
    background: 'none',
    color: colors.text.light,
    cursor: 'pointer',
    position: 'relative',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    width: Math.min(380, typeof window !== 'undefined' ? window.innerWidth - 32 : 380),
    maxHeight: 400,
    overflow: 'auto',
    backgroundColor: colors.admin.inactive,
    border: `1px solid ${colors.neutral.borderDark}`,
    borderRadius: 12,
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    zIndex: 50,
  };

  const itemStyle = (lida: boolean): React.CSSProperties => ({
    padding: spacing[3],
    borderBottom: `1px solid ${colors.neutral.borderDark}`,
    backgroundColor: lida ? 'transparent' : 'rgba(53, 152, 255, 0.06)',
    cursor: 'pointer',
  });

  return (
    <header style={headerStyle}>
      {onMenuClick && (
        <button type="button" onClick={onMenuClick} aria-label="Abrir menu" style={iconBtnStyle}>
          <Menu size={24} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h1 style={{ margin: 0, fontSize: isMd ? fontSizes.xl : fontSizes.lg, fontWeight: 600, color: colors.text.light }}>
            {title}
          </h1>
        )}
      </div>

      <div style={{ position: 'relative' }} ref={panelRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Notificações'}
          style={iconBtnStyle}
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 18,
                height: 18,
                padding: '0 5px',
                borderRadius: 9999,
                backgroundColor: colors.blue.primary,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div style={dropdownStyle}>
            <div style={{ padding: spacing[3], borderBottom: `1px solid ${colors.neutral.borderDark}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: colors.text.light, fontSize: fontSizes.sm }}>Notificações</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: colors.blue.primary,
                    fontSize: fontSizes.xs,
                    cursor: 'pointer',
                  }}
                >
                  Marcar todas como lidas
                </button>
              )}
            </div>
            {loading ? (
              <div style={{ padding: spacing[3], display: 'grid', gap: spacing[2] }}>
                <div style={{ height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.07)' }} />
                <div style={{ height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              </div>
            ) : notificacoes.length === 0 ? (
              <div style={{ padding: spacing[6], textAlign: 'center', color: colors.text.light, opacity: 0.7, fontSize: fontSizes.sm }}>
                Nenhuma notificação.
              </div>
            ) : (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  style={itemStyle(!!n.lidaEm)}
                  onClick={() => {
                    if (!n.lidaEm) markAsRead(n.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!n.lidaEm) markAsRead(n.id);
                    }
                  }}
                >
                  <div style={{ fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>
                    {n.titulo}
                  </div>
                  {n.mensagem && (
                    <div style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.9, marginTop: 2 }}>
                      {n.mensagem}
                    </div>
                  )}
                  <div style={{ fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.6, marginTop: 4 }}>
                    {formatDate(n.criadaEm)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
};
