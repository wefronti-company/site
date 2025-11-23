import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { QuoteModalProvider } from '../contexts/QuoteModalContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import QuoteModal from '../components/ui/QuoteModal';
import CustomCursor from '../components/ui/CustomCursor';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <ThemeProvider>
        <LanguageProvider>
          <QuoteModalProvider>
            <CustomCursor />
            <Component {...pageProps} />
            <QuoteModal />
          </QuoteModalProvider>
        </LanguageProvider>
      </ThemeProvider>
    </>
  );
}