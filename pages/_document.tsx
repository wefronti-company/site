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
 <link rel="icon" href="/images/brand/favicon-light.png" type="image/png" sizes="32x32" media="(prefers-color-scheme: light)" />
 <link rel="icon" href="/images/brand/favicon-dark.png" type="image/png" sizes="32x32" media="(prefers-color-scheme: dark)" />
 {/* Fallback */}
 <link rel="icon" href="/images/brand/favicon-light.png" type="image/png" sizes="32x32" />
 <link rel="apple-touch-icon" href="/images/brand/favicon-light.png" sizes="180x180" />
 <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
 <meta name="theme-color" content="#050505" media="(prefers-color-scheme: dark)" />
 
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
