import React, { useState, useEffect } from 'react';
import { theme } from '../../styles/theme';
import { getAdminCache, setAdminCache } from '../../lib/adminCache';
import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

const { colors, spacing, fontSizes } = theme;

const appBarStyle: React.CSSProperties = {
  position: 'fixed',
  top: spacing[4],
  left: SIDEBAR_WIDTH + spacing[4],
  right: spacing[4],
  height: ADMIN_HEADER_HEIGHT,
  minHeight: ADMIN_HEADER_HEIGHT,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
  backgroundColor: colors.admin.sidebar,
  backdropFilter: 'saturate(150%) blur(14px)',
  WebkitBackdropFilter: 'saturate(150%) blur(14px)',
  borderRadius: 8,
  border: `1px solid ${colors.neutral.borderDark}`,
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
  backgroundColor: 'rgba(102, 191, 130, 0.2)',
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

function getInitial(nameOrEmail: string): string {
  const first = nameOrEmail.charAt(0);
  return first ? first.toUpperCase() : 'A';
}

export const AppBar: React.FC = () => {
  const [admin, setAdmin] = useState<{ nome: string | null; email: string } | null>(null);

  useEffect(() => {
    const cached = getAdminCache();
    if (cached) setAdmin(cached);

    fetch('/api/admin/me', { credentials: 'same-origin' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const v = { nome: data.nome ?? null, email: data.email };
          setAdminCache(v);
          setAdmin(v);
        }
      })
      .catch(() => {});
  }, []);

  const displayName = admin?.nome?.trim() || admin?.email || '';
  const initial = admin ? getInitial(admin.nome?.trim() || admin.email) : '';

  return (
    <header style={appBarStyle} role="banner">
      <div style={userWrapStyle}>
        {initial ? (
          <div style={avatarStyle} aria-hidden>
            {initial}
          </div>
        ) : null}
        {displayName ? <span style={userNameStyle}>{displayName}</span> : null}
      </div>
    </header>
  );
};

export default AppBar;
