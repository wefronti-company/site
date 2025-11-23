import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../contexts/ThemeContext';
import { QuoteModalProvider } from '../contexts/QuoteModalContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import QuoteModal from '../components/ui/QuoteModal';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QuoteModalProvider>
          <Component {...pageProps} />
          <QuoteModal />
        </QuoteModalProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}