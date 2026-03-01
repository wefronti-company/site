import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LayoutDashboard, FileText, FileX, PlusCircle, LogOut, User, ShieldPlus, Inbox, CheckCircle } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { clearAdminCache } from '../../lib/adminCache';
import ButtonPainel from '../ui/ButtonPainel';

const { colors, spacing, fontSizes, radii } = theme;

import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

export const sidebarWidth = SIDEBAR_WIDTH;

const PROPOSTA_ITEMS = [
  { label: 'Nova proposta', href: '/admin/dashboard/proposta/nova', icon: <PlusCircle size={16} strokeWidth={1.5} /> },
  { label: 'Proposta ativa', href: '/admin/dashboard/proposta/ativa', icon: <FileText size={16} strokeWidth={1.5} /> },
  { label: 'Proposta expiradas', href: '/admin/dashboard/proposta/expiradas', icon: <FileX size={16} strokeWidth={1.5} /> },
];

const FORM_ITEMS = [
  { label: 'Novos orçamentos', href: '/admin/dashboard/form/novos', icon: <Inbox size={16} strokeWidth={1.5} /> },
  { label: 'Respondidos', href: '/admin/dashboard/form/respondidos', icon: <CheckCircle size={16} strokeWidth={1.5} /> },
];

const sidebarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: sidebarWidth,
  height: '100vh',
  backgroundColor: colors.admin.sidebar,
  backdropFilter: 'saturate(150%) blur(14px)',
  WebkitBackdropFilter: 'saturate(150%) blur(14px)',
  borderRight: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 40,
};

const logoWrapStyle: React.CSSProperties = {
  height: ADMIN_HEADER_HEIGHT,
  minHeight: ADMIN_HEADER_HEIGHT,
  padding: spacing[4],
  borderBottom: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
};

const logoLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  textDecoration: 'none',
};

const navWrapStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  position: 'relative',
};

const navScrollStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 88,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: spacing[3],
  WebkitOverflowScrolling: 'touch',
};

const logoutWrapStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: spacing[3],
  paddingTop: spacing[6],
  marginTop: spacing[4],
  borderTop: `1px solid ${colors.neutral.borderDark}`,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.6rem',
  fontWeight: 300,
  color: colors.text.light,
  opacity: 0.6,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginTop: spacing[5],
  marginBottom: spacing[2],
  paddingLeft: spacing[3],
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  padding: `${spacing[2]}px ${spacing[3]}px ${spacing[2]}px ${spacing[3]}px`,
  color: colors.text.light,
  fontSize: fontSizes.sm,
  opacity: isActive ? 1 : 0.9,
  textDecoration: 'none',
  borderRadius: radii.md,
  backgroundColor: isActive ? colors.admin.active : colors.admin.inactive,
});

interface SidebarProps {
  currentPath: string;
}

const isDashboardActive = (path: string) =>
  path === '/admin/dashboard' || path === '/dashboard';

const LOGOUT_RED = '#f87171';

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const router = useRouter();
  const { showSuccess } = useSnackbar();
  const [superAdmin, setSuperAdmin] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSuperAdmin(data.superAdmin === true))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setModalAberto(false);
    clearAdminCache();
    await fetch('/api/admin/logout', { method: 'POST' });
    showSuccess('Você saiu do painel.');
    router.push('/admin');
  };

  return (
    <aside style={sidebarStyle} role="navigation" aria-label="Menu principal">
      <div style={logoWrapStyle}>
        <Link href="/admin/dashboard" style={logoLinkStyle} aria-label="Dashboard">
          <Image
            src="/images/brand/isologo-wefronti.webp"
            alt="Wefronti"
            width={120}
            height={32}
            style={{ objectFit: 'contain', maxWidth: '100%' }}
          />
        </Link>
      </div>

      <div style={navWrapStyle}>
        <nav style={navScrollStyle} data-lenis-prevent>
        <Link
          href="/admin/dashboard"
          style={{ ...navLinkStyle(isDashboardActive(currentPath)), marginBottom: spacing[2] }}
          className="admin-nav-item"
        >
          <LayoutDashboard size={16} strokeWidth={1.5} aria-hidden style={{ flexShrink: 0 }} />
          Dashboard
        </Link>

        <div style={sectionLabelStyle}>Formulário</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {FORM_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={navLinkStyle(currentPath === item.href)}
              className="admin-nav-item"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ ...sectionLabelStyle, marginTop: spacing[8] }}>Proposta comercial</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {PROPOSTA_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={navLinkStyle(currentPath === item.href)}
              className="admin-nav-item"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ ...sectionLabelStyle, marginTop: spacing[8] }}>Administrador</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          <Link
            href="/admin/dashboard/admin/perfil"
            style={navLinkStyle(currentPath === '/admin/dashboard/admin/perfil')}
            className="admin-nav-item"
          >
            <User size={16} strokeWidth={1.5} />
            Perfil
          </Link>
          {superAdmin && (
            <Link
              href="/admin/dashboard/admin/novo"
              style={navLinkStyle(currentPath === '/admin/dashboard/admin/novo')}
              className="admin-nav-item"
            >
              <ShieldPlus size={16} strokeWidth={1.5} />
              Adicionar admin
            </Link>
          )}
        </div>
        </nav>
        <div style={logoutWrapStyle}>
          <button
            type="button"
            onClick={() => setModalAberto(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[2],
              padding: `${spacing[2]}px ${spacing[3]}px ${spacing[2]}px ${spacing[3]}px`,
              width: '100%',
              border: `1px solid rgba(248, 113, 113, 0.5)`,
              borderRadius: radii.md,
              cursor: 'pointer',
              textAlign: 'left',
              font: 'inherit',
              fontSize: fontSizes.sm,
              fontWeight: 500,
              color: LOGOUT_RED,
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
            }}
            className="admin-nav-item"
          >
            <LogOut size={16} strokeWidth={1.5} style={{ flexShrink: 0, color: LOGOUT_RED }} />
            Sair
          </button>
        </div>
      </div>

      {modalAberto && (
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
          onClick={() => setModalAberto(false)}
          role="dialog"
          aria-modal
          aria-labelledby="modal-titulo"
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
            <h3 id="modal-titulo" style={{ margin: 0, marginBottom: spacing[4], fontSize: fontSizes.lg, fontWeight: 600, color: colors.text.light, textAlign: 'left' }}>
              Sair do painel?
            </h3>
            <p style={{ margin: 0, marginBottom: spacing[6], fontSize: fontSizes.base, color: colors.text.light, opacity: 0.8, textAlign: 'left' }}>
              Deseja realmente sair do painel administrativo?
            </p>
            <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                style={{
                  padding: `${spacing[2]}px ${spacing[4]}`,
                  fontSize: fontSizes.sm,
                  fontWeight: 500,
                  color: colors.text.light,
                  backgroundColor: 'transparent',
                  border: `1px solid ${colors.neutral.borderDark}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <ButtonPainel type="button" onClick={handleLogout}>
                Sim, sair
              </ButtonPainel>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
