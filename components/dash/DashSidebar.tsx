import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LayoutDashboard, User, Wallet, LogOut } from 'lucide-react';
import { theme } from '../../styles/theme';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { DASH_HEADER_HEIGHT, DASH_SIDEBAR_WIDTH } from './constants';

const { colors, spacing, fontSizes, radii } = theme;

export const dashSidebarWidth = DASH_SIDEBAR_WIDTH;

// No subdomínio dash, o middleware redireciona /dash/dashboard -> /dashboard (URL limpa)
const navItems = [
  { label: 'Dashboard', href: '/dash/dashboard', icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
  { label: 'Financeiro', href: '/dash/dashboard/financeiro', icon: <Wallet size={18} strokeWidth={1.5} /> },
  { label: 'Meus dados', href: '/dash/dashboard/perfil', icon: <User size={18} strokeWidth={1.5} /> },
];

const logoWrapStyle: React.CSSProperties = {
  height: DASH_HEADER_HEIGHT,
  minHeight: DASH_HEADER_HEIGHT,
  padding: spacing[4],
  borderBottom: `1px solid ${colors.neutral.borderDark}`,
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
};

const navWrapStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing[3],
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[2],
};

const navLinkStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[4]}px ${spacing[5]}px`,
  color: colors.text.light,
  fontSize: fontSizes.base,
  opacity: isActive ? 1 : 0.9,
  textDecoration: 'none',
  borderRadius: radii.md,
  backgroundColor: isActive ? colors.admin.active : colors.admin.inactive,
});

const logoutStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[4]}px ${spacing[5]}px`,
  width: '100%',
  border: 'none',
  borderRadius: radii.md,
  cursor: 'pointer',
  textAlign: 'left',
  font: 'inherit',
  fontSize: fontSizes.base,
  color: 'rgba(248, 113, 113, 0.95)',
  backgroundColor: 'rgba(248, 113, 113, 0.1)',
  marginTop: 'auto',
};

interface DashSidebarProps {
  currentPath: string;
  onClose?: () => void;
}

export const DashSidebar: React.FC<DashSidebarProps> = ({ currentPath, onClose }) => {
  const router = useRouter();
  const { showSuccess } = useSnackbar();

  const handleLogout = async () => {
    onClose?.();
    await fetch('/api/cliente/logout', { method: 'POST', credentials: 'include' });
    showSuccess('Você saiu da sua conta.');
    router.push('/dash');
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: DASH_SIDEBAR_WIDTH,
    height: '100vh',
    backgroundColor: colors.admin.background,
    borderRight: `1px solid ${colors.neutral.borderDark}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 40,
    transform: 'translateX(-100%)',
  };

  return (
    <aside style={sidebarStyle} className="dash-sidebar" role="navigation" aria-label="Menu">
      <div style={logoWrapStyle}>
        <Link href="/dash/dashboard" aria-label="Dashboard">
          <Image
            src="/images/brand/isologo-white.webp"
            alt="Wefronti"
            width={110}
            height={30}
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </div>
      <nav style={navWrapStyle}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={navLinkStyle(currentPath === item.href)}
            onClick={onClose}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <button type="button" style={logoutStyle} onClick={handleLogout}>
          <LogOut size={18} strokeWidth={1.5} />
          Sair
        </button>
      </nav>
    </aside>
  );
};
