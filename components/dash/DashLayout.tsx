import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DashSidebar } from './DashSidebar';
import { DashHeader } from './DashHeader';
import { DASH_HEADER_HEIGHT, DASH_SIDEBAR_WIDTH } from './constants';
import { theme } from '../../styles/theme';
import { useDashUsuario } from '../../contexts/DashUsuarioContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const { colors, spacing } = theme;

const layoutStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.admin.background,
  display: 'flex',
};

interface DashLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const DashLayout: React.FC<DashLayoutProps> = ({ children }) => {
  const router = useRouter();
  const isMd = useMediaQuery(theme.breakpoints.md);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { usuario } = useDashUsuario();
  const saudacao = usuario?.nomeCompleto
    ? `Olá, ${usuario.nomeCompleto.split(' ')[0] || 'usuário'}!`
    : 'Olá!';

  useEffect(() => {
    if (isMd) setSidebarOpen(false);
  }, [isMd]);

  useEffect(() => {
    const handler = () => setSidebarOpen(false);
    router.events.on('routeChangeComplete', handler);
    return () => router.events.off('routeChangeComplete', handler);
  }, [router.events]);

  const mainWrapStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    paddingTop: DASH_HEADER_HEIGHT,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: isMd ? spacing[8] : spacing[4],
  };

  return (
    <div style={layoutStyle} className={`dash-layout${sidebarOpen ? ' dash-drawer-open' : ''}`}>
      <DashSidebar currentPath={router.pathname} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && !isMd && (
        <div
          role="presentation"
          aria-hidden
          onClick={() => setSidebarOpen(false)}
          className="dash-sidebar-overlay"
        />
      )}
      <div style={mainWrapStyle} className="dash-main-wrap">
        <DashHeader
          title={saudacao}
          onMenuClick={!isMd ? () => setSidebarOpen(true) : undefined}
        />
        <main style={contentStyle} role="main">
          {children}
        </main>
      </div>
      <style jsx global>{`
        .dash-sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 35;
        }
        .dash-sidebar {
          transition: transform 0.25s ease-out;
        }
        .dash-layout.dash-drawer-open .dash-sidebar {
          transform: translateX(0) !important;
        }
        .dash-main-wrap {
          margin-left: 0;
        }
        @media (min-width: 768px) {
          .dash-sidebar {
            transform: translateX(0) !important;
            transition: none;
          }
          .dash-main-wrap {
            margin-left: ${DASH_SIDEBAR_WIDTH}px;
          }
          .dash-sidebar-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default DashLayout;
