import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { GA_TRACKING_ID } from '../lib/gtag';

export default function Document() {
 return (
 <Html lang="pt-BR" data-scroll-behavior="smooth">
 <Head>
 {/* Google tag (gtag.js) — instalação manual conforme recomendação do Google */}
 {GA_TRACKING_ID && (
   <>
     <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
     <script
       dangerouslySetInnerHTML={{
         __html: `
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());
           gtag('config', '${GA_TRACKING_ID}');
         `,
       }}
     />
   </>
 )}
 {/* Meta tags para SEO */}
 <meta httpEquiv="x-ua-compatible" content="ie=edge" />
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 
 {/* Favicon — incrementar ?v= para invalidar cache ao atualizar o ícone */}
 <link rel="icon" href="/favicon.ico?v=3" />
  <link rel="icon" href="/images/brand/favicon-site.png?v=3" type="image/png" sizes="32x32" />
  <link rel="shortcut icon" href="/images/brand/favicon-site.png?v=3" />
  <link rel="apple-touch-icon" href="/images/brand/favicon-site.png?v=3" sizes="180x180" />
 
 {/* Google Fonts - Geist */}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Geist:wght@100..900&display=swap" rel="stylesheet" />
 
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
