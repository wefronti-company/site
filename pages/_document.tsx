import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
 return (
 <Html lang="pt-BR" data-scroll-behavior="smooth">
 <Head>
 {/* Meta tags para SEO */}
 <meta httpEquiv="x-ua-compatible" content="ie=edge" />
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 
 {/* Favicon */}
 <link rel="icon" href="/images/brand/favicon-dark.png" type="image/png" sizes="32x32" />
 <link rel="shortcut icon" href="/images/brand/favicon-dark.png" />
 {/* Fallback */}
 <link rel="icon" href="/images/brand/favicon-dark.png" type="image/png" sizes="32x32" />
 <link rel="apple-touch-icon" href="/images/brand/favicon-dark.png" sizes="180x180" />
 <meta name="theme-color" content="#040404" />
 
 {/* Google Fonts - Funnel Sans */}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
 
 </Head>
 <body className="body-grid" style={{ backgroundColor: '#040404' }}>
 <Main />

 {/* Client-side JS chunk retry: if a script from /_next/static/chunks fails to load, attempt a few retries with cache-busting query param */}
 <script dangerouslySetInnerHTML={{ __html: `
  (function(){
    try {
      var MAX_RETRIES = 3;
      window.addEventListener('error', function(e){
        var t = e.target || e.srcElement;
        if (!t) return;
        if (t.tagName === 'SCRIPT' && t.src && t.src.indexOf('/_next/static/chunks/') !== -1) {
          var current = parseInt(t.getAttribute('data-retry-count') || '0', 10) || 0;
          if (current >= MAX_RETRIES) return;
          var next = current + 1;
          var src = t.src;
          var sep = src.indexOf('?') === -1 ? '?' : '&';
          var newSrc = src + sep + 'retry=' + next + '&cb=' + Date.now();
          var s = document.createElement('script');
          s.src = newSrc;
          s.async = true;
          s.setAttribute('data-retry-count', String(next));
          if (t.crossOrigin) s.crossOrigin = t.crossOrigin;
          s.onload = function(){ console.info('[retry] script loaded', newSrc); };
          s.onerror = function(){ console.warn('[retry] script failed', newSrc); };
          document.head.appendChild(s);
        }
      }, true);
    } catch (err) {
      console.error('chunk-retry init error', err);
    }
  })();
 `}} />

 <NextScript />
 </body>
 </Html>
 );
}
