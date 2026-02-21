import React from 'react';
import { theme } from '../../styles/theme';
import { ADMIN_HEADER_HEIGHT } from './constants';

const { colors, spacing, fontSizes } = theme;

// Usuário mockado – substituir por dados da sessão quando houver auth
const CURRENT_USER = {
  name: 'Admin',
  initials: 'A',
};

const appBarStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  height: ADMIN_HEADER_HEIGHT,
  minHeight: ADMIN_HEADER_HEIGHT,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingLeft: spacing[6],
  paddingRight: spacing[6],
  backgroundColor: colors.admin.background,
  borderBottom: `1px solid ${colors.neutral.borderDark}`,
  zIndex: 30,
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
  backgroundColor: 'rgba(53, 152, 255, 0.2)',
  border: `1px solid ${colors.blue.primary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: fontSizes.sm,
  fontWeight: 600,
  color: colors.blue.primary,
};

const userNameStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: 500,
  color: colors.text.light,
  margin: 0,
};

export const AppBar: React.FC = () => {
  return (
    <header style={appBarStyle} role="banner">
      <div style={userWrapStyle}>
        <div style={avatarStyle} aria-hidden>
          {CURRENT_USER.initials}
        </div>
        <span style={userNameStyle}>{CURRENT_USER.name}</span>
      </div>
    </header>
  );
};

export default AppBar;
