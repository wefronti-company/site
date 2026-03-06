import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';

const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    width: 100%;
    overflow-x: hidden;
    font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #__next {
    min-height: 100vh;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet" />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <Header />
      <Component {...pageProps} />
    </>
  );
}
