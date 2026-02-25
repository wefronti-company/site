import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export interface UsuarioDash {
  id: string;
  nomeCompleto: string;
  email: string;
  codigoReferencia: string;
  celular?: string;
  dataNascimento?: string;
  cpf?: string;
  enderecoLogradouro?: string;
  enderecoNumero?: string;
  enderecoComplemento?: string;
  enderecoBairro?: string;
  enderecoCidade?: string;
  enderecoUf?: string;
  enderecoCep?: string;
  chavePix?: string;
  banco?: string;
  nomeTitular?: string;
  whatsappNumero?: string;
  whatsappMensagem?: string;
  ativo?: boolean;
  totalIndicacoes?: number;
}

interface DashUsuarioContextValue {
  usuario: UsuarioDash | null;
  loading: boolean;
  refetch: () => void;
}

const DashUsuarioContext = createContext<DashUsuarioContextValue | null>(null);

const DASH_PROTECTED_PREFIX = '/dash/dashboard';
const USER_SYNC_POLL_MS = 8000;
const DASH_USER_STORAGE_KEY = 'wefronti_dash_user_v1';

function readCachedUsuario(): UsuarioDash | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DASH_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UsuarioDash;
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedUsuario(usuario: UsuarioDash | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!usuario) {
      window.localStorage.removeItem(DASH_USER_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(DASH_USER_STORAGE_KEY, JSON.stringify(usuario));
  } catch {
    // ignore cache failures
  }
}

export function DashUsuarioProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioDash | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback((opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    if (!silent) setLoading(true);
    fetch('/api/usuario/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUsuario(data);
        writeCachedUsuario(data);
      })
      .catch(() => {
        setUsuario(null);
        writeCachedUsuario(null);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }, []);

  useEffect(() => {
    const isProtected = router.pathname.startsWith(DASH_PROTECTED_PREFIX);
    if (!isProtected) {
      setLoading(false);
      return;
    }
    const cachedUser = readCachedUsuario();
    if (cachedUser) {
      setUsuario(cachedUser);
      setLoading(false);
      fetchUser({ silent: true });
    } else {
      fetchUser();
    }

    const syncSilently = () => fetchUser({ silent: true });
    const interval = setInterval(syncSilently, USER_SYNC_POLL_MS);
    const onFocus = () => syncSilently();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') syncSilently();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [router.pathname, fetchUser]);

  return (
    <DashUsuarioContext.Provider value={{ usuario, loading, refetch: fetchUser }}>
      {children}
    </DashUsuarioContext.Provider>
  );
}

export function useDashUsuario() {
  const ctx = useContext(DashUsuarioContext);
  if (!ctx) throw new Error('useDashUsuario must be used within DashUsuarioProvider');
  return ctx;
}
