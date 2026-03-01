import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { Eye, Bell, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';
import { getAdminCache, setAdminCache, clearAdminCache } from '../../lib/adminCache';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

const { colors, spacing, fontSizes, radii } = theme;
const LOGOUT_RED = '#f87171';

const logoutBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  width: '100%',
  minHeight: 42,
  padding: `${spacing[3]}px ${spacing[4]}`,
  marginTop: spacing[2],
  border: `1px solid rgba(248, 113, 113, 0.5)`,
  borderRadius: radii.md,
  cursor: 'pointer',
  textAlign: 'left',
  font: 'inherit',
  fontSize: fontSizes.sm,
  fontWeight: 500,
  lineHeight: 1.2,
  color: LOGOUT_RED,
  backgroundColor: 'rgba(248, 113, 113, 0.1)',
};


const userWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
};

const avatarStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: 'rgba(102, 191, 130, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.blue.primary,
  cursor: 'pointer',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: spacing[2],
  minWidth: 200,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  padding: spacing[3],
  zIndex: 50,
};

const NOTIFICATIONS_READ_KEY = 'wefronti_notifications_read';

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function markNotificationRead(id: string): void {
  try {
    const ids = getReadIds();
    ids.add(id);
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
}

function getInitial(nameOrEmail: string): string {
  const first = nameOrEmail.charAt(0);
  return first ? first.toUpperCase() : 'A';
}

function formatNotificationDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Agora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

interface RequestNotification {
  id: string;
  tipo: string;
  nome: string;
  sobrenome: string;
  criado_em: string;
}

interface AppBarProps {
  isMobile?: boolean;
  onMenuClick?: () => void;
}

export const AppBar: React.FC<AppBarProps> = ({ isMobile = false, onMenuClick }) => {
  const router = useRouter();
  const { showSuccess } = useSnackbar();
  const [admin, setAdmin] = useState<{ nome: string | null; email: string } | null>(null);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<RequestNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const bellWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = getAdminCache();
    if (cached) setAdmin(cached);

    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const v = { nome: data.nome ?? null, email: data.email };
          setAdminCache(v);
          setAdmin(v);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchCount = () =>
      fetch('/api/live-visitors', { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : { count: 0 }))
        .then((d) => setLiveCount(d.count ?? 0))
        .catch(() => setLiveCount(null));
    fetchCount();
    const id = setInterval(fetchCount, 45000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  useEffect(() => {
    const fetchNotifications = () =>
      fetch('/api/admin/requests?status=novo', { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Array<{ id: string; tipo: string; nome: string; sobrenome: string; criado_em: string }>) =>
          setNotifications(data.slice(0, 10))
        )
        .catch(() => setNotifications([]));
    fetchNotifications();
    const id = setInterval(fetchNotifications, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        avatarRef.current &&
        !avatarRef.current.contains(target) &&
        bellWrapRef.current &&
        !bellWrapRef.current.contains(target)
      ) {
        setAvatarOpen(false);
        setBellOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLogoutModalOpen(false);
    setAvatarOpen(false);
    clearAdminCache();
    await fetch('/api/admin/logout', { method: 'POST' });
    showSuccess('Você saiu do painel.');
    router.push('/admin');
  };

  const displayName = admin?.nome?.trim() || admin?.email || '';
  const adminEmail = admin?.email ?? '';
  const initial = admin ? getInitial(admin.nome?.trim() || admin.email) : '';
  const unreadNotifications = notifications.filter((n) => !readIds.has(n.id));
  const hasNewBudgets = unreadNotifications.length > 0;

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id);
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setBellOpen(false);
    router.push('/admin/dashboard/form/novos');
  };

  const liveBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    fontSize: fontSizes.sm,
    color: colors.text.light,
    opacity: 0.9,
  };

  const appBarStyle: React.CSSProperties = {
    position: 'fixed',
    top: spacing[4],
    left: isMobile ? spacing[4] : SIDEBAR_WIDTH + spacing[4],
    right: spacing[4],
    height: ADMIN_HEADER_HEIGHT,
    minHeight: ADMIN_HEADER_HEIGHT,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    backgroundColor: colors.admin.sidebar,
    backdropFilter: 'saturate(150%) blur(14px)',
    WebkitBackdropFilter: 'saturate(150%) blur(14px)',
    borderRadius: 8,
    border: `1px solid ${colors.neutral.borderDark}`,
    zIndex: 30,
  };

  const iconBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    padding: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.text.light,
    borderRadius: radii.full,
    position: 'relative' as const,
  };

  return (
    <header style={appBarStyle} role="banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
        {isMobile && onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Abrir menu"
            style={{
              ...iconBtnStyle,
              marginRight: spacing[2],
            }}
          >
            <Menu size={22} strokeWidth={1.5} aria-hidden />
          </button>
        )}
        <div style={liveBadgeStyle} title="Pessoas navegando no site agora">
          <Eye size={18} aria-hidden />
          <span>{liveCount !== null ? liveCount : '—'}</span>
        </div>
      </div>

      <div style={userWrapStyle}>
        <div ref={bellWrapRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setBellOpen((o) => !o)}
            aria-label="Notificações"
            aria-expanded={bellOpen}
            style={iconBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <motion.div
              animate={hasNewBudgets ? { scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] } : {}}
              transition={{ repeat: hasNewBudgets ? Infinity : 0, duration: 1.5, repeatDelay: 2 }}
            >
              <Bell size={20} aria-hidden />
            </motion.div>
            {hasNewBudgets && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#f87171',
                }}
              />
            )}
          </button>

          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{ ...dropdownStyle, right: 0, minWidth: isMobile ? 280 : 360, maxWidth: isMobile ? 'calc(100vw - 32px)' : undefined }}
              >
                <p style={{ margin: 0, marginBottom: spacing[3], fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>
                  Notificações
                </p>
                {notifications.length === 0 ? (
                  <p style={{ margin: 0, fontSize: fontSizes.sm, color: colors.text.light, opacity: 0.7 }}>
                    Nenhum orçamento novo.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => handleNotificationClick(n.id)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          fontSize: fontSizes.sm,
                          color: colors.text.light,
                          padding: spacing[2],
                          borderRadius: 6,
                          backgroundColor: readIds.has(n.id) ? 'transparent' : 'rgba(0,0,0,0.03)',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: readIds.has(n.id) ? 0.8 : 1,
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Novo orçamento de: {n.tipo || 'Solicitação'}
                        </span>
                        <span style={{ display: 'block', opacity: 0.7, fontSize: fontSizes.xs, marginTop: 2 }}>
                          {formatNotificationDate(n.criado_em)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={avatarRef} style={{ position: 'relative' }}>
          {initial ? (
            <button
              type="button"
              onClick={() => setAvatarOpen((o) => !o)}
              style={{
                ...avatarStyle,
                border: 'none',
                outline: 'none',
              }}
              aria-label="Menu do usuário"
              aria-expanded={avatarOpen}
            >
              {initial}
            </button>
          ) : null}
          <AnimatePresence>
            {avatarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={dropdownStyle}
              >
                <p style={{ margin: 0, marginBottom: adminEmail ? spacing[2] : spacing[4], fontSize: fontSizes.sm, fontWeight: 600, color: colors.text.light }}>
                  {displayName}
                </p>
                {adminEmail ? (
                  <p style={{ margin: 0, marginBottom: spacing[4], fontSize: fontSizes.xs, color: colors.text.light, opacity: 0.8 }}>
                    {adminEmail}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setAvatarOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  style={logoutBtnStyle}
                >
                  <LogOut size={16} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {typeof document !== 'undefined' &&
        logoutModalOpen &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: spacing[4],
            }}
            onClick={() => setLogoutModalOpen(false)}
            role="dialog"
            aria-modal
            aria-labelledby="appbar-modal-titulo"
          >
            <div
              style={{
                backgroundColor: colors.admin.inactive,
                border: `1px solid ${colors.neutral.borderDark}`,
                borderRadius: 12,
                padding: spacing[6],
                maxWidth: 360,
                width: '100%',
                textAlign: 'left',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="appbar-modal-titulo" style={{ margin: 0, marginBottom: spacing[4], fontSize: fontSizes.lg, fontWeight: 600, color: colors.text.light }}>
                Sair do painel?
              </h3>
              <p style={{ margin: 0, marginBottom: spacing[6], fontSize: fontSizes.base, color: colors.text.light, opacity: 0.8 }}>
                Deseja realmente sair do painel administrativo?
              </p>
              <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() => setLogoutModalOpen(false)}
                  style={{
                    ...logoutBtnStyle,
                    marginTop: 0,
                    width: 'auto',
                    minWidth: 112,
                    padding: `${spacing[3]}px ${spacing[5]}px`,
                    justifyContent: 'center',
                    color: colors.text.light,
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.neutral.borderDark}`,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    ...logoutBtnStyle,
                    marginTop: 0,
                    width: 'auto',
                    minWidth: 112,
                    padding: `${spacing[3]}px ${spacing[5]}px`,
                    justifyContent: 'center',
                    color: '#fff',
                    backgroundColor: LOGOUT_RED,
                    border: 'none',
                  }}
                >
                  Sim, sair
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default AppBar;
