import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SplashContextValue {
  splashActive: boolean;
  setSplashActive: (value: boolean) => void;
}

const SplashContext = createContext<SplashContextValue | null>(null);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [splashActive, setSplashActive] = useState(() => router.pathname === '/');
  const setter = useCallback((value: boolean) => setSplashActive(value), []);

  useEffect(() => {
    if (router.pathname !== '/') setSplashActive(false);
  }, [router.pathname]);

  return (
    <SplashContext.Provider value={{ splashActive, setSplashActive: setter }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const ctx = useContext(SplashContext);
  return ctx;
}
