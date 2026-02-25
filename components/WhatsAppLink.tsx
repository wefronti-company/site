import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { buildReferralWhatsAppMessage, buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';

interface ReferralWhatsAppData {
  nome: string;
  whatsappNumero: string;
  whatsappMensagem: string;
}

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  defaultMessage: string;
}

export default function WhatsAppLink({ defaultMessage, href, ...props }: WhatsAppLinkProps) {
  const router = useRouter();
  const [refData, setRefData] = useState<ReferralWhatsAppData | null>(null);

  useEffect(() => {
    const ref = typeof router.query.ref === 'string' ? router.query.ref.trim().toLowerCase() : '';
    if (!ref) {
      setRefData(null);
      return;
    }

    let cancelled = false;
    fetch(`/api/referencia/whatsapp?ref=${encodeURIComponent(ref)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data === 'object') {
          setRefData({
            nome: String(data.nome || ''),
            whatsappNumero: String(data.whatsappNumero || ''),
            whatsappMensagem: String(data.whatsappMensagem || ''),
          });
        } else {
          setRefData(null);
        }
      })
      .catch(() => {
        if (!cancelled) setRefData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [router.query.ref]);

  const finalHref = useMemo(() => {
    const msg = buildReferralWhatsAppMessage(
      refData || undefined,
      defaultMessage
    );
    const number = refData?.whatsappNumero || DEFAULT_WHATSAPP_NUMBER;
    return buildWhatsAppUrl(number, msg);
  }, [refData, defaultMessage]);

  return <a {...props} href={href || finalHref} />;
}

