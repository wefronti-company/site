// Google Analytics tracking ID
// Read the GA tracking ID from environment so it can be configured per-deploy
// Use NEXT_PUBLIC_GA_ID since this value must be available in the client bundle.
// Sanitize to prevent XSS if env is ever compromised (GA4: G-XXX, Universal: UA-XXX-X).
const RAW_GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const GA_TRACKING_ID = /^(G-[A-Za-z0-9]+|UA-\d+-\d+)$/.test(RAW_GA_ID) ? RAW_GA_ID : '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Carregar script do Google Analytics — defer até após first paint para não bloquear main thread
export const loadGoogleAnalytics = () => {
  if (typeof window === 'undefined') return;

  if (!GA_TRACKING_ID) return;
  if (window.gtag) return;

  const load = () => {
    if (window.gtag) return;
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
    `;
    document.head.appendChild(script2);
  };

  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(load, { timeout: 2000 });
  } else {
    setTimeout(load, 1000);
  }
};

// Declaração de tipos para TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
