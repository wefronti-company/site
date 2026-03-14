import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
 return (
 <Html lang="pt-BR" data-scroll-behavior="smooth">
 <Head>
 {/* GA carregado via _app após first paint para não bloquear main thread */}
 {/* Meta tags para SEO */}
 <meta httpEquiv="x-ua-compatible" content="ie=edge" />
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 
 {/* LCP — preload da imagem do Hero para descoberta imediata e prioridade alta */}
 <link rel="preload" href="/images/brand/background.webp" as="image" fetchPriority="high" />

 {/* Open Graph — fallback para crawlers (Facebook, WhatsApp, etc.) */}
 <meta property="og:type" content="website" />
 <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com'} />
 <meta property="og:title" content={`${process.env.NEXT_PUBLIC_SITE_NAME || 'Wefronti'} | Criação de sites que vendem`} />
 <meta property="og:description" content="Sites que convertem visitantes em clientes. Desenvolvimento com foco em resultado para empresas que querem vender mais online." />
 <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com'}/images/brand/social-seo-image.webp?v=1`} />
 <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com'}/images/brand/social-seo-image.webp?v=1`} />
 <meta property="og:image:type" content="image/webp" />
 <meta property="og:image:width" content="1200" />
 <meta property="og:image:height" content="630" />
 <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME || 'Wefronti'} />
 <meta property="og:locale" content="pt_BR" />
 <meta name="twitter:card" content="summary_large_image" />
 <meta name="twitter:title" content={`${process.env.NEXT_PUBLIC_SITE_NAME || 'Wefronti'} | Criação de sites que vendem`} />
 <meta name="twitter:description" content="Sites que convertem visitantes em clientes. Desenvolvimento com foco em resultado para empresas que querem vender mais online." />
 <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com'}/images/brand/social-seo-image.webp?v=1`} />
 
 {/* PWA / App name — exibe "Wefronti" em vez do domínio em bookmarks, etc. */}
 <link rel="manifest" href="/manifest.json" />
 {/* Favicon — ?v= para invalidar cache (bump ao atualizar o ícone) */}
 <link rel="icon" href="/favicon.ico?v=5" />
  <link rel="icon" href="/images/brand/favicon-site.png?v=5" type="image/png" sizes="32x32" />
  <link rel="shortcut icon" href="/images/brand/favicon-site.png?v=5" />
  <link rel="apple-touch-icon" href="/images/brand/favicon-site.png?v=5" sizes="180x180" />
 
 {/* Google Fonts — carregamento não bloqueante (PageSpeed) */}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link
   id="font-funnel-sans"
   rel="stylesheet"
   href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap"
   media="print"
 />
 <script
   dangerouslySetInnerHTML={{
     __html: `document.getElementById('font-funnel-sans').onload=function(){this.media='all'};`,
   }}
 />
 <noscript>
   <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
 </noscript>
 
 </Head>
 <body>
 <Main />

 {/* Client-side JS chunk retry: se um script de /_next/static/chunks falhar (503, rede, deploy), tenta novamente */}
 <script dangerouslySetInnerHTML={{ __html: `
  (function(){
    try {
      var MAX_RETRIES = 3;
      var RELOAD_KEY = 'wefronti_chunk_reload';
      window.addEventListener('error', function(e){
        var t = e.target || e.srcElement;
        if (!t) return;
        if (t.tagName === 'SCRIPT' && t.src && t.src.indexOf('/_next/static/chunks/') !== -1) {
          var current = parseInt(t.getAttribute('data-retry-count') || '0', 10) || 0;
          if (current >= MAX_RETRIES) {
            var last = parseInt(sessionStorage.getItem(RELOAD_KEY) || '0', 10);
            if (Date.now() - last > 10000) {
              sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
              window.location.reload();
            }
            return;
          }
          var next = current + 1;
          var src = t.src;
          var sep = src.indexOf('?') === -1 ? '?' : '&';
          var newSrc = src + sep + 'retry=' + next + '&cb=' + Date.now();
          var s = document.createElement('script');
          s.src = newSrc;
          s.async = true;
          s.setAttribute('data-retry-count', String(next));
          if (t.crossOrigin) s.crossOrigin = t.crossOrigin;
          s.onload = function(){ /* chunk carregou */ };
          s.onerror = function(){ /* will trigger error handler again */ };
          document.head.appendChild(s);
        }
      }, true);
    } catch (err) { console.error('chunk-retry init error', err); }
  })();
 `}} />

 <NextScript />
 </body>
 </Html>
 );
}
