import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import GlobalStyles from '../components/GlobalStyles';
import * as gtag from '../lib/gtag';

const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false });
import Header from '../components/ui/Header';
import Footer from '../sections/Footer';
export default function MyApp({ Component, pageProps }: AppProps) {
 const router = useRouter();
 const isAdminRoute = router.pathname.startsWith('/painel-admin');

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

 // Inserir comentário logo antes do <html> no DOM (executado no cliente)
 React.useEffect(() => {
   try {
     if (typeof document !== 'undefined' && document.documentElement) {
       const comment = '<!-- Made in Framer · framer.com ✨ -->';
       // prevenir duplicatas
       const prev = document.doctype ? null : null;
       // insert only if not already present
       if (!document.documentElement.previousSibling || (document.documentElement.previousSibling && document.documentElement.previousSibling.nodeType !== Node.COMMENT_NODE)) {
         document.documentElement.insertAdjacentHTML('beforebegin', comment);
       }
     }
   } catch (e) {
     // ignore
   }
 }, []);

 return (
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <GlobalStyles />
 {!isAdminRoute && <Header />}
 <Component {...pageProps} />
 {!isAdminRoute && router.pathname !== '/' && <Footer />}
 <CookieConsent />
 </>
 );
}