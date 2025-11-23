import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Meta tags para SEO */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        
        {/* Preconnect para recursos externos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font optimization com display=swap */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Preload imagens críticas */}
        <link rel="preload" href="/images/isologo-white.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/isologo-black.webp" as="image" type="image/webp" />
      </Head>
      <body className="body-grid">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
