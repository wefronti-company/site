import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Sidebar, sidebarWidth } from './Sidebar';
import { AppBar } from './AppBar';
import { theme } from '../../styles/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ADMIN_HEADER_HEIGHT } from './constants';

const { colors, spacing } = theme;

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.admin.background,
  display: 'flex',
  minWidth: 0,
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
  const mqMatches = useMediaQuery(theme.breakpoints.md);
  const [hydrated, setHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Antes da hidratação, assume mobile para evitar flash de sidebar abrindo/fechando
  const isMd = hydrated ? mqMatches : false;

  const mainWrapStyle: React.CSSProperties = {
    flex: 1,
    marginLeft: isMd ? sidebarWidth : 0,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: spacing[4] + ADMIN_HEADER_HEIGHT + spacing[4],
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    paddingLeft: isMd ? spacing[4] : spacing[3],
    paddingRight: isMd ? spacing[4] : spacing[3],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
    minWidth: 0,
    overflowX: 'hidden',
  };

  useEffect(() => {
    if (!isMd && sidebarOpen && typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMd, sidebarOpen]);

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
      <Sidebar
        currentPath={getNavPath(router.pathname)}
        isMobile={!isMd}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={mainWrapStyle}>
        <AppBar
          isMobile={!isMd}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main style={contentStyle} role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
