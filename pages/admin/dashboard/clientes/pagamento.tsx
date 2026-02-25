import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Redirect: a aba Pagamentos foi movida para Financeiro > Pagamentos.
 */
export default function ClientesPagamentoRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard/financeiro/pagamentos');
  }, [router]);
  return null;
}
