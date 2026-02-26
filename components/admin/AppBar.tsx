import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search } from 'lucide-react';
import { theme } from '../../styles/theme';
import { getAdminCache, setAdminCache } from '../../lib/adminCache';
import { ADMIN_HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants';

interface ClienteBusca {
  id: string;
  nome: string;
  email: string;
  razaoSocial: string;
}

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
  justifyContent: 'space-between',
  paddingLeft: spacing[4],
  paddingRight: spacing[4],
  backgroundColor: colors.admin.sidebar,
  borderRadius: 8,
  border: `1px solid ${colors.neutral.borderDark}`,
  zIndex: 30,
};

const searchWrapStyle: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  maxWidth: 460,
  marginRight: spacing[6],
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px`,
  minHeight: 44,
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 6,
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  fontSize: fontSizes.base,
  color: colors.text.light,
  outline: 'none',
};

const searchIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: colors.text.light,
  opacity: 0.6,
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: spacing[2],
  padding: spacing[3],
  backgroundColor: colors.admin.inactive,
  border: `1px solid ${colors.neutral.borderDark}`,
  borderRadius: 8,
  maxHeight: 280,
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 50,
};

const resultItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  width: '100%',
  padding: `${spacing[3]}px ${spacing[4]}`,
  textAlign: 'left',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: fontSizes.sm,
  color: colors.text.light,
  textDecoration: 'none',
  borderRadius: 6,
  marginBottom: spacing[1],
  boxSizing: 'border-box',
};

const resultItemLastName: React.CSSProperties = {
  ...resultItemStyle,
  marginBottom: 0,
};

const resultAvatarStyle: React.CSSProperties = {
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
  flexShrink: 0,
};

const resultContentStyle: React.CSSProperties = {
  minWidth: 0,
  flex: 1,
};

const resultLabelStyle: React.CSSProperties = {
  fontWeight: 600,
  display: 'block',
  marginBottom: 2,
  fontSize: fontSizes.base,
};

const resultMetaStyle: React.CSSProperties = {
  fontSize: fontSizes.sm,
  opacity: 0.7,
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

function getInitial(nameOrEmail: string): string {
  const first = nameOrEmail.charAt(0);
  return first ? first.toUpperCase() : 'A';
}

const DEBOUNCE_MS = 300;

export const AppBar: React.FC = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [admin, setAdmin] = useState<{ nome: string | null; email: string } | null>(null);
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState<ClienteBusca[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

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

  useEffect(() => {
    const t = busca.trim();
    if (t.length < 1) {
      setResultados([]);
      setDropdownAberto(false);
      return;
    }
    const id = setTimeout(() => {
      setBuscando(true);
      fetch(`/api/clientes/busca?q=${encodeURIComponent(t)}`, { credentials: 'same-origin' })
        .then((r) => (r.ok ? r.json() : []))
        .then((data) => {
          setResultados(Array.isArray(data) ? data : []);
          setDropdownAberto(true);
        })
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [busca]);

  const handleClickFora = useCallback((e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setDropdownAberto(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, [handleClickFora]);

  const selecionarCliente = (id: string) => {
    setBusca('');
    setResultados([]);
    setDropdownAberto(false);
    router.push(`/admin/dashboard/clientes/${id}/editar`);
  };

  const displayName = admin?.nome?.trim() || admin?.email || '';
  const initial = admin ? getInitial(admin.nome?.trim() || admin.email) : '';

  return (
    <header style={appBarStyle} role="banner">
      <div style={searchWrapStyle} ref={searchRef}>
        <Search size={20} style={searchIconStyle} aria-hidden />
        <input
          type="search"
          placeholder="Buscar cliente..."
          aria-label="Buscar cliente"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onFocus={() => resultados.length > 0 && setDropdownAberto(true)}
          style={searchInputStyle}
        />
        {dropdownAberto && resultados.length > 0 && (
          <div style={dropdownStyle} role="listbox">
            {resultados.map((c, i) => (
              <Link
                key={c.id}
                href={`/admin/dashboard/clientes/${c.id}/editar`}
                style={i === resultados.length - 1 ? resultItemLastName : resultItemStyle}
                onClick={(e) => {
                  e.preventDefault();
                  selecionarCliente(c.id);
                }}
              >
                <div style={resultAvatarStyle} aria-hidden>
                  {getInitial(c.nome || c.email)}
                </div>
                <div style={resultContentStyle}>
                  <span style={resultLabelStyle}>{c.razaoSocial}</span>
                  <span style={resultMetaStyle}>{c.nome} · {c.email}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {dropdownAberto && busca.trim().length >= 1 && !buscando && resultados.length === 0 && (
          <div style={{ ...dropdownStyle, padding: spacing[4], color: colors.text.light, opacity: 0.8 }}>
            Nenhum cliente encontrado.
          </div>
        )}
      </div>
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
