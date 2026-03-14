import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import GlobalStyles from '../components/GlobalStyles';
import * as gtag from '../lib/gtag';
import SmoothScroll from '../components/SmoothScroll';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import TabTitleNotification from '../components/TabTitleNotification';

export default function MyApp({ Component, pageProps }: AppProps) {
 const router = useRouter();

 React.useEffect(() => {
   gtag.loadGoogleAnalytics();
   const handleRouteChange = (url: string) => gtag.pageview(url);
   router.events.on('routeChangeComplete', handleRouteChange);
   return () => router.events.off('routeChangeComplete', handleRouteChange);
 }, [router.events]);

 React.useEffect(() => {
   const preventContextMenu = (e: Event) => e.preventDefault();
   document.addEventListener('contextmenu', preventContextMenu);
   return () => document.removeEventListener('contextmenu', preventContextMenu);
 }, []);

 React.useEffect(() => {
   try {
     if (typeof document !== 'undefined' && document.documentElement) {
       const siteDomain = (process.env.NEXT_PUBLIC_SITE_URL || 'https://wefronti.com').replace(/^https?:\/\//, '');
       const comment = `<!-- Desenvolvido por ${process.env.NEXT_PUBLIC_SITE_NAME || 'Wefronti'} · ${siteDomain} -->`;
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
 <SmoothScroll>
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <GlobalStyles />
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <Component {...pageProps} />
        {router.pathname !== '/' && !(Component as React.ComponentType & { is404?: boolean })?.is404 }
        <FloatingWhatsApp />
        <TabTitleNotification />
      </div>
 </>
 </SmoothScroll>
 );
}