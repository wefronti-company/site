import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, CreditCard, AlertCircle, UserMinus, LayoutDashboard } from 'lucide-react';
import { theme } from '../../styles/theme';

const { colors, spacing, fontSizes, radii } = theme;

import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

export const sidebarWidth = SIDEBAR_WIDTH;

const CLIENTE_ITEMS = [
  { label: 'Ativos', href: '/dashboard/clientes/ativos', icon: <Users size={18} strokeWidth={1.5} /> },
  { label: 'Pagamentos', href: '/dashboard/clientes/pagamento', icon: <CreditCard size={18} strokeWidth={1.5} /> },
  { label: 'Inadimplentes', href: '/dashboard/clientes/inadiplentes', icon: <AlertCircle size={18} strokeWidth={1.5} /> },
  { label: 'Desligados', href: '/dashboard/clientes/desligados', icon: <UserMinus size={18} strokeWidth={1.5} /> },
];

const sidebarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  width: sidebarWidth,
  backgroundColor: colors.admin.background,
  borderRight: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  flexDirection: 'column',
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

const navStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: spacing[3],
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 300,
  color: colors.text.light,
  opacity: 0.6,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginTop: spacing[5],
  marginBottom: spacing[3],
  paddingLeft: spacing[3],
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[4]}px ${spacing[5]}px ${spacing[4]}px ${spacing[4]}px`,
  color: colors.text.light,
  fontSize: fontSizes.base,
  opacity: isActive ? 1 : 0.9,
  textDecoration: 'none',
  borderRadius: radii.md,
  backgroundColor: isActive ? colors.admin.active : colors.admin.inactive,
});

interface SidebarProps {
  currentPath: string;
}

const isDashboardActive = (path: string) =>
  path === '/dashboard' || path === '/admin/dashboard';

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  return (
    <aside style={sidebarStyle} role="navigation" aria-label="Menu principal">
      <div style={logoWrapStyle}>
        <Link href="/dashboard" style={logoLinkStyle} aria-label="Dashboard">
          <Image
            src="/images/brand/isologo-white.webp"
            alt="Wefronti"
            width={120}
            height={32}
            style={{ objectFit: 'contain', maxWidth: '100%' }}
          />
        </Link>
      </div>

      <nav style={navStyle}>
        <Link
          href="/dashboard"
          style={{ ...navLinkStyle(isDashboardActive(currentPath)), marginBottom: spacing[2] }}
          className="admin-nav-item"
        >
          <LayoutDashboard size={18} strokeWidth={1.5} aria-hidden style={{ flexShrink: 0 }} />
          Dashboard
        </Link>

        <div style={sectionLabelStyle}>Clientes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
          {CLIENTE_ITEMS.map((item) => (
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
      </nav>
    </aside>
  );
};

export default Sidebar;
