import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Página obsoleta. O fluxo de redefinição de senha agora é por código
 * e acontece inteiro na página esqueci-senha.
 */
export default function RedefinirSenhaRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dash/esqueci-senha');
  }, [router]);
  return null;
}
