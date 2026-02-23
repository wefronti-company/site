import React from 'react';
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

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

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
