import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Sidebar, sidebarWidth } from './Sidebar';
import { AppBar } from './AppBar';
import { theme } from '../../styles/theme';
import { ADMIN_HEADER_HEIGHT } from './constants';

const { colors, spacing } = theme;

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.admin.background,
  display: 'flex',
};

const mainWrapStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: sidebarWidth,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: ADMIN_HEADER_HEIGHT,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing[8],
};

/** Path completo para highlight da sidebar */
function getNavPath(pathname: string): string {
  return pathname || '/admin/dashboard';
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

/** Intervalo de refresh: 10 min (antes dos 15 min de inatividade) */
const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const refresh = () => {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      fetch('/api/admin/refresh', { method: 'POST', credentials: 'include' })
        .then((r) => {
          if (!r.ok) router.replace('/admin');
        })
        .catch(() => {});
    };
    const id = setInterval(refresh, REFRESH_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [router]);

  return (
    <div style={layoutStyle}>
      <Sidebar currentPath={getNavPath(router.pathname)} />
      <div style={mainWrapStyle}>
        <AppBar />
        <main style={contentStyle} role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
