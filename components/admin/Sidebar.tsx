import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Users, CreditCard, AlertCircle, UserMinus, LayoutDashboard, FileText, FileX, PlusCircle, LogOut, UserPlus, List } from 'lucide-react';
import { theme } from '../../styles/theme';

const { colors, spacing, fontSizes, radii } = theme;

import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

export const sidebarWidth = SIDEBAR_WIDTH;

const CLIENTE_ITEMS = [
  { label: 'Cadastrar novo', href: '/admin/dashboard/clientes/novo', icon: <UserPlus size={18} strokeWidth={1.5} /> },
  { label: 'Todos os clientes', href: '/admin/dashboard/clientes/todos', icon: <List size={18} strokeWidth={1.5} /> },
  { label: 'Ativos', href: '/admin/dashboard/clientes/ativos', icon: <Users size={18} strokeWidth={1.5} /> },
  { label: 'Pagamentos', href: '/admin/dashboard/clientes/pagamento', icon: <CreditCard size={18} strokeWidth={1.5} /> },
  { label: 'Inadimplentes', href: '/admin/dashboard/clientes/inadiplentes', icon: <AlertCircle size={18} strokeWidth={1.5} /> },
  { label: 'Desligados', href: '/admin/dashboard/clientes/desligados', icon: <UserMinus size={18} strokeWidth={1.5} /> },
];

const PROPOSTA_ITEMS = [
  { label: 'Nova proposta', href: '/admin/dashboard/proposta/nova', icon: <PlusCircle size={18} strokeWidth={1.5} /> },
  { label: 'Proposta ativa', href: '/admin/dashboard/proposta/ativa', icon: <FileText size={18} strokeWidth={1.5} /> },
  { label: 'Proposta expiradas', href: '/admin/dashboard/proposta/expiradas', icon: <FileX size={18} strokeWidth={1.5} /> },
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
  path === '/admin/dashboard' || path === '/dashboard';

export const Sidebar: React.FC<SidebarProps> = ({ currentPath }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.reload();
  };

  return (
    <aside style={sidebarStyle} role="navigation" aria-label="Menu principal">
      <div style={logoWrapStyle}>
        <Link href="/admin/dashboard" style={logoLinkStyle} aria-label="Dashboard">
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
          href="/admin/dashboard"
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

        <div style={{ marginTop: 'auto', paddingTop: spacing[4], borderTop: `1px solid ${colors.neutral.borderDark}` }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              ...navLinkStyle(false),
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              font: 'inherit',
            }}
            className="admin-nav-item"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Sair
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
