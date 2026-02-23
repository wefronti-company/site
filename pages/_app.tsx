import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import GlobalStyles from '../components/GlobalStyles';
import * as gtag from '../lib/gtag';
import 'lenis/dist/lenis.css';
import SmoothScroll from '../components/SmoothScroll';
import Header from '../components/ui/Header';
import { SplashProvider } from '../contexts/SplashContext';

const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false });
import Footer from '../sections/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
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

 // Inserir comentário logo antes do <html> no DOM (executado no cliente)
 // Admin: usa admin.background (#0A0C12) em html/body/#__next
 React.useEffect(() => {
   const isAdmin = router.pathname.startsWith('/admin');
   document.documentElement.classList.toggle('admin-route', isAdmin);
   document.body.classList.toggle('admin-route', isAdmin);
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
 <SmoothScroll>
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
 <GlobalStyles />
 {!router.pathname.startsWith('/admin') && !router.pathname.startsWith('/proposta') && <Header />}
 <Component {...pageProps} />
 {router.pathname !== '/' && !router.pathname.startsWith('/admin') && !router.pathname.startsWith('/proposta') && <Footer />}
 {!router.pathname.startsWith('/admin') && !router.pathname.startsWith('/proposta') && <FloatingWhatsApp />}
 <CookieConsent />
 </>
 </SmoothScroll>
 </SplashProvider>
 );
}