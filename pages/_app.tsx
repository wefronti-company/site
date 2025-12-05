import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import * as gtag from '../lib/gtag';

const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
 const router = useRouter();

 React.useEffect(() => {
   const handleRouteChange = (url: string) => {
     // Rastrear mudanças de página apenas se analytics foi aceito
     const consent = localStorage.getItem('cookieConsent');
     if (consent) {
       const prefs = JSON.parse(consent);
       if (prefs.analytics) {
         gtag.pageview(url);
       }
     }
   };
   
   router.events.on('routeChangeComplete', handleRouteChange);
   return () => {
     router.events.off('routeChangeComplete', handleRouteChange);
   };
 }, [router.events]);

 return (
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <Component {...pageProps} />
 <CookieConsent />
 </>
 );
}