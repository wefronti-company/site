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
 <link rel="icon" href="/images/favicon-site.png" type="image/webp" />
 <link rel="apple-touch-icon" href="/images/favicon-site.png" />
 
 {/* Google Fonts - Funnel Sans */}
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
 <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
 
 </Head>
 <body className="body-grid">
 <Main />
 <NextScript />
 </body>
 </Html>
 );
}
