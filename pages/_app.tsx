import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QuoteModalProvider } from '../contexts/QuoteModalContext';
import QuoteModal from '../components/ui/QuoteModal';

export default function MyApp({ Component, pageProps }: AppProps) {
 return (
 <>
 <Head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
 </Head>
		<QuoteModalProvider>
			{/* AppBar is now rendered inside the Hero section; render pages directly */}
			<Component {...pageProps} />

	 <QuoteModal />
 </QuoteModalProvider>
 </>
 );
}