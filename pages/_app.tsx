import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import GlobalStyles from '../components/GlobalStyles';
import * as gtag from '../lib/gtag';
import 'lenis/dist/lenis.css';
import SmoothScroll from '../components/SmoothScroll';
import { SnackbarProvider } from '../contexts/SnackbarContext';

import Footer from '../sections/Footer';
import AsteriskDecor from '../components/AsteriskDecor';

export default function MyApp({ Component, pageProps }: AppProps) {
 const router = useRouter();

 React.useEffect(() => {
   gtag.loadGoogleAnalytics();
   const handleRouteChange = (url: string) => gtag.pageview(url);
   router.events.on('routeChangeComplete', handleRouteChange);
   return () => router.events.off('routeChangeComplete', handleRouteChange);
 }, [router.events]);

 React.useEffect(() => {
   try {
     if (typeof document !== 'undefined' && document.documentElement) {
       const comment = '<!-- Desenvolvido por Wefronti · wefronti.com -->';
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
 <SnackbarProvider>
 <SmoothScroll>
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <GlobalStyles />
<AsteriskDecor />
      <Component {...pageProps} />
      {router.pathname !== '/' && <Footer />}
 </>
 </SmoothScroll>
 </SnackbarProvider>
 );
}