import React, { useMemo } from 'react';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp';

interface WhatsAppLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  defaultMessage: string;
}

export default function WhatsAppLink({ defaultMessage, href, ...props }: WhatsAppLinkProps) {
  const finalHref = useMemo(
    () => href || buildWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, defaultMessage),
    [href, defaultMessage]
  );
  return <a {...props} href={finalHref} />;
}
