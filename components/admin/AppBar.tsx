import React, { useState, useEffect } from 'react';
import { theme } from '../../styles/theme';
import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

const { colors, spacing, fontSizes } = theme;

const appBarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: SIDEBAR_WIDTH,
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

function getInitial(email: string): string {
  const first = email.charAt(0);
  return first ? first.toUpperCase() : 'A';
}

export const AppBar: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setEmail(data.email))
      .catch(() => {});
  }, []);

  return (
    <header style={appBarStyle} role="banner">
      <div style={userWrapStyle}>
        <div style={avatarStyle} aria-hidden>
          {email ? getInitial(email) : 'A'}
        </div>
        <span style={userNameStyle}>{email || 'Admin'}</span>
      </div>
    </header>
  );
};

export default AppBar;
