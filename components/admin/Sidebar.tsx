import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, User, ShieldPlus, Inbox, CheckCircle, MessageSquare, X } from 'lucide-react';
import { theme } from '../../styles/theme';

const { colors, spacing, fontSizes, radii } = theme;

import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

export const sidebarWidth = SIDEBAR_WIDTH;

const FORM_ITEMS = [
  { label: 'Novos orçamentos', href: '/admin/dashboard/form/novos', icon: <Inbox size={16} strokeWidth={1.5} /> },
  { label: 'Respondidos', href: '/admin/dashboard/form/respondidos', icon: <CheckCircle size={16} strokeWidth={1.5} /> },
  { label: 'Contato', href: '/admin/dashboard/form/contato', icon: <MessageSquare size={16} strokeWidth={1.5} /> },
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
  bottom: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: spacing[3],
  WebkitOverflowScrolling: 'touch',
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
  color: isActive ? '#fff' : colors.text.light,
  fontSize: fontSizes.sm,
  opacity: isActive ? 1 : 0.9,
  textDecoration: 'none',
  borderRadius: radii.md,
  backgroundColor: isActive ? colors.admin.active : colors.admin.inactive,
});

interface SidebarProps {
  currentPath: string;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

const isDashboardActive = (path: string) =>
  path === '/admin/dashboard' || path === '/dashboard';

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, isMobile = false, open = false, onClose }) => {
  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSuperAdmin(data.superAdmin === true))
      .catch(() => {});
  }, []);

  const asideStyle: React.CSSProperties = {
    ...sidebarStyle,
    ...(isMobile ? {
      width: sidebarWidth,
      transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.25s ease-out',
      boxShadow: open ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
    } : {}),
  };

  const handleNavClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <>
      {isMobile && open && (
        <div
          role="presentation"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'saturate(140%) blur(8px)',
            WebkitBackdropFilter: 'saturate(140%) blur(8px)',
            zIndex: 39,
            transition: 'opacity 0.25s ease-out',
          }}
          aria-hidden
        />
      )}
    <aside style={asideStyle} role="navigation" aria-label="Menu principal">
      <div style={{ ...logoWrapStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/admin/dashboard" onClick={handleNavClick} style={logoLinkStyle} aria-label="Dashboard">
          <Image
            src="/images/brand/isologo-wefronti.webp"
            alt="Wefronti"
            width={120}
            height={32}
            style={{ objectFit: 'contain', maxWidth: '100%' }}
          />
        </Link>
        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              border: 'none',
              background: 'transparent',
              color: colors.text.light,
              cursor: 'pointer',
              borderRadius: radii.md,
            }}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div style={navWrapStyle}>
        <nav style={navScrollStyle} data-lenis-prevent>
        <Link
          href="/admin/dashboard"
          onClick={handleNavClick}
          style={{ ...navLinkStyle(isDashboardActive(currentPath)), marginBottom: spacing[2] }}
          className="admin-nav-item"
        >
          <LayoutDashboard size={16} strokeWidth={1.5} aria-hidden style={{ flexShrink: 0, color: 'inherit' }} />
          Dashboard
        </Link>

        <div style={sectionLabelStyle}>Formulário</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {FORM_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              style={navLinkStyle(currentPath === item.href)}
              className="admin-nav-item"
            >
              <span style={{ color: 'inherit' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div style={{ ...sectionLabelStyle, marginTop: spacing[8] }}>Administrador</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          <Link
            href="/admin/dashboard/admin/perfil"
            onClick={handleNavClick}
            style={navLinkStyle(currentPath === '/admin/dashboard/admin/perfil')}
            className="admin-nav-item"
          >
            <span style={{ color: 'inherit' }}><User size={16} strokeWidth={1.5} /></span>
            Perfil
          </Link>
          {superAdmin && (
            <Link
              href="/admin/dashboard/admin/novo"
              onClick={handleNavClick}
              style={navLinkStyle(currentPath === '/admin/dashboard/admin/novo')}
              className="admin-nav-item"
            >
              <span style={{ color: 'inherit' }}><ShieldPlus size={16} strokeWidth={1.5} /></span>
              Adicionar admin
            </Link>
          )}
        </div>
        </nav>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
