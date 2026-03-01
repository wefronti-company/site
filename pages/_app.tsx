import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import GlobalStyles from '../components/GlobalStyles';
import * as gtag from '../lib/gtag';
import 'lenis/dist/lenis.css';
import SmoothScroll from '../components/SmoothScroll';
import Header from '../components/ui/Header';
import { SplashProvider } from '../contexts/SplashContext';
import { SnackbarProvider } from '../contexts/SnackbarContext';

import Footer from '../sections/Footer';
import BottomCtaOrWhatsApp from '../components/BottomCtaOrWhatsApp';
export default function MyApp({ Component, pageProps }: AppProps) {
 const router = useRouter();

 React.useEffect(() => {
   gtag.loadGoogleAnalytics();

   const trackView = (url: string) => {
     if (!url.startsWith('/admin')) {
       fetch('/api/track-view', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ path: url || '/' }),
       }).catch(() => {});
     }
   };

   const handleRouteChange = (url: string) => {
     gtag.pageview(url);
     trackView(url);
   };

   trackView(router.asPath);
   router.events.on('routeChangeComplete', handleRouteChange);
   return () => router.events.off('routeChangeComplete', handleRouteChange);
 }, [router.events, router.asPath]);

 // Inserir comentário logo antes do <html> no DOM (executado no cliente)
 // Mantemos fundo global do site também no admin.
 React.useEffect(() => {
   document.documentElement.classList.remove('admin-route');
   document.body.classList.remove('admin-route');
   return () => {
     document.documentElement.classList.remove('admin-route');
     document.body.classList.remove('admin-route');
   };
 }, [router.pathname]);

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
 <SplashProvider>
 <SnackbarProvider>
 <SmoothScroll>
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <GlobalStyles />
{!router.pathname.startsWith('/admin') && <Header />}
      <Component {...pageProps} />
      {router.pathname !== '/' && !router.pathname.startsWith('/admin') && <Footer />}
      {!router.pathname.startsWith('/admin') && <BottomCtaOrWhatsApp />}
 </>
 </SmoothScroll>
 </SnackbarProvider>
 </SplashProvider>
 );
}