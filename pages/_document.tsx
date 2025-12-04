import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
 return (
 <Html lang="pt-BR" data-scroll-behavior="smooth">
 <Head>
 {/* Meta tags para SEO */}
 <meta httpEquiv="x-ua-compatible" content="ie=edge" />
 
 {/* Favicon */}
 <link rel="icon" href="/images/favicon-site.webp" type="image/webp" />
 <link rel="apple-touch-icon" href="/images/favicon-site.webp" />
 
 {/* Preconnect para recursos externos críticos */}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
 
 {/* Font optimization com display=swap */}
 <link 
 href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;500;600;700&display=swap" 
 rel="stylesheet" 
 />
 </Head>
 <body className="body-grid">
 <Main />
 <NextScript />
 </body>
 </Html>
 );
}
